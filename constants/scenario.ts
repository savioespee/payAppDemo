import { inviteUser, leaveChannel, sendMessage } from '../api/platformAPI';
import { parseMessageData } from '../utils/dataUtils';
import logError from '../utils/logError';
import { botUserIds } from './botUsers';
import { channelCustomTypes, messageCustomTypes } from './common';
import { sendMessageAndTranslate } from '../api/utils';
import { getTime } from 'date-fns';


export const scenario: ScenarioData = {
  key: 'toss',
  defaultLanguage: 'en',
  userProfile: {
    nickname: 'Alex',
  },
  channels: [
    {
      members: [botUserIds.supportBot],
      name: 'Support',
      customType: channelCustomTypes.support,
      initialReadAt: 0,
      states: {
        initial: {
          messages: [
            {
              sender: botUserIds.supportBot,
              content: 'Hello Alex, I am SendBot. Welcome to SendPay’s Customer Support. How can I help you today?',
              createdAt: '-1m',
            },
          ],
          onChannelEnter(context) {
            context.transitionState('botMessages');
          },
        },
        botMessages: {
          messages: [
            {
              sender: botUserIds.supportBot,
              content: 'Please confirm that you have read and agreed with SendPay’s Data Privacy Policy here https://www.sendpay.com/privacy',
            },
            {
              sender: botUserIds.supportBot,
              content: 'Please confirm if you would like to continue?',
            },
          ],
          after: { targetState: 'AlexReplies1' },
        },
        AlexReplies1: {
          suggestedReplies: [['Confirm', 'botChecksIssue'], 'Cancel'],
        },
        botChecksIssue: {
          messages: [
            {
              sender: botUserIds.supportBot,
              content: 'Is this regarding the money transfer you made earlier as per this image?',
              data: { cover: 'PaymentReceiptShare.png', actions: [{ label: '', variant: 'translucent-light' }] },
              //data: { localImageName: 'PaymentReceiptShare.png' },
            },
          ],
          after: { targetState: 'AlexReplies2' },
        },
        AlexReplies2: {
          suggestedReplies: [['Yes', 'AlexReplies2_1'], 'No'],
        },
        AlexReplies2_1: {
          messages: [
          ], after: { delay: 1000, targetState: 'agentConfirmed' },
        },
        agentConfirmed: {
          messages: [

            {
              sender: botUserIds.supportBot,
              content: 'Thank you for the confirmation',
            },
          ], after: { delay: 3000, targetState: 'AlexReplies3' },
        },
        AlexReplies3: {
          messages: [
            {
              sender: 'ME',
              content: 'My friend could not see the amount in his account.',
            },
          ],
          after: { delay: 2000, targetState: 'botReplies2' },
        },
        botReplies2: {
          messages: [
            {
              sender: botUserIds.supportBot,
              content: 'I’m sorry to hear that.',
            },
            {
              sender: botUserIds.supportBot,
              content: ' Let me connect you to a live agent. Please hold.',
            },
          ],
          after: { delay: 1000, targetState: 'agentConnected' },
        },
        agentConnected: {
          messages: [
            {
              sender: botUserIds.daniel,
              content:
                'Hey Alex, I see you’re having issue with your payment.',
            },
          ],
          after: { delay: 2000, targetState: 'agentConnected1' },
        },
        agentConnected1: {
          messages: [
            {
              sender: botUserIds.daniel,
              content:
                ' I would like to let you know that sometimes the transfer may take upto 24 hours. But for inconvinience caused, we would like to offer you a gift voucker.',
            },
          ],
          after: { delay: 3000, targetState: 'AlexReplies' },
          onEntry(context) {
            return leaveChannel(context.channelUrl, botUserIds.supportBot);
          },
        },
        AlexReplies: {
          messages: [
            {
              sender: 'ME',
              content: 'Hi Daniel, thanks for helping out.',
            },
          ], after: { delay: 1000, targetState: 'agentSendVoucher' },
        },
        agentSendVoucher: {
          messages: [
            {
              sender: botUserIds.daniel,
              customType: messageCustomTypes.marketing,
              content: '$30 Voucher for your next purchase with us',
              data: { cover: 'voucher.png', actions: [{ label: 'Claim Now', variant: 'light' }] },
            },
          ],

          async onActionPress(data, { transitionState }) {
            const { channelUrl } = data.message;
            try {
              await inviteUser(channelUrl, botUserIds.supportBot);
              await sendMessageAndTranslate(
                channelUrl, {
                message_type: 'MESG',
                user_id: botUserIds.supportBot,
                message: '🎉 Congratulations!!! 🎉\nYou have successfully claimed your $30 SendPay voucher.',
              },
              ),
                transitionState('alexSaysThanksbefore');
            } catch (error) {
              logError(error);
            }
          },
        },
        alexSaysThanksbefore: {
          messages: [
          ],
          after: { delay: 2000, targetState: 'alexSaysThanks' },
        },
        alexSaysThanks: {
          messages: [
            {
              sender: 'ME',
              content: 'That is wonderful! 😃',
            },
          ],
          after: { delay: 2000, targetState: 'byeFromDaniel' },
        },
        byeFromDaniel: {
          messages: [
            {
              sender: botUserIds.daniel,
              content: 'Great. I’ll be closing out this ticket. Thank you and have a nice day!',
            },
          ],
          after: { delay: 2000, targetState: 'csat' },
        },
        csat: {
          messages: [
            {
              sender: botUserIds.supportBot,
              customType: messageCustomTypes.csat,
              content: 'How was your chat experience?',
              data: { csat: 0 },
            },
          ],
          async onCSATSelect(data, context) {
            const { score } = data;
            const originalMessageData = parseMessageData(data.message.data);
            await context.updateUserMessage({
              channelUrl: context.channelUrl,
              messageId: data.message.messageId,
              payload: { data: JSON.stringify({ ...originalMessageData, csat: score }) },
            });
            context.transitionState('end');
          },
        },
        end: {
          messages: [
            {
              sender: botUserIds.supportBot,
              content: 'Thanks for your feedback.',
            },
          ],
        },
      },
    },
    {
      // New channel
      name: 'Hailey',
      customType: channelCustomTypes.paydemo,
      members: [botUserIds.hailey],
      states: {
        initial: {
          messages: [
            {
              sender: 'ME',
              content: 'Hey Hailey, how are you?',
              createdAt: '-35m'
            },
          ],
          onChannelEnter(context) {
            context.transitionState('haileyReplies1');
          },
        }, //individual state
        haileyReplies1: {
          messages: [
            {
              sender: botUserIds.hailey,
              content: 'Hi, I am good, thank you. Hope you are doing good too.',
              createdAt: '-30m',
            },
          ],
          after: { delay: 3000, targetState: 'paymentConfirmation' },
        },
        alexReplies1: {
          messages: [
            {
              sender: 'ME',
              content: 'Just checking, have you got the money I sent you some time back?',
              createdAt: '-29m',
            },
          ],
          after: { delay: 3000, targetState: 'paymentConfirmation' },
        },
        paymentConfirmation: {
          messages: [
            {
              sender: 'ME',
              content: 'Just checking, have you got the money I sent you some time back? Here are the transaction details.',
              data: { cover: 'PaymentReceiptShare.png', actions: [{ label: '', variant: 'translucent-light' }] },
              //data: { localImageName: 'PaymentReceiptShare.png' },
            },
          ],
          after: { delay: 6000, targetState: 'haileyReplies2' },
          /*   async onActionPress(data, { transitionState }) {
               const { channelUrl } = data.message;
               try {
                 await inviteUser(channelUrl, 'ME');
                 await sendMessageAndTranslate(
                   channelUrl, {
                   message_type: 'MESG',
                   user_id: 'ME',
                   message: 'Great, thanks for confirmation.',
                 },
                 ),
                   transitionState('haileyReplies2');
               } catch (error) {
                 logError(error);
               }
             },*/
        },
        haileyReplies2: {
          messages: [
            {
              sender: botUserIds.hailey,
              content: 'yeah, I got it. Thanks Sweety.',
            },
          ], after: { delay: 3000, targetState: 'haileyReplies2_2' },
        },
        haileyReplies2_2: {
          messages: [
            {
              sender: 'ME',
              content: 'Cool!! Lets catch up some time this weekend. Take care.',

            },
          ], after: { delay: 3000, targetState: 'haileyReplies3' },
        },
        haileyReplies3: {
          messages: [
            {
              sender: botUserIds.hailey,
              content: 'Sure, bbye!',
            },
          ],
        },
      }, //state
    }, //channel
    {
      // New channel
      name: 'Pine St Group',
      customType: channelCustomTypes.friends,
      members: [botUserIds.hailey, botUserIds.amanda, botUserIds.casey],
      states: {
        initial: {
          messages: [
            {
              sender: botUserIds.amanda,
              content: 'Hey guys! John is completing five years this month and we are planning for a gift for him. Willing to split the cost of $200 with me? If so click the button to split.',
              createdAt: '-5m'
            },
          ],
          onChannelEnter(context) {
            context.transitionState('alexSaysOk');
          },
        }, //individual state
        alexSaysOk: {
          messages: [
            {
              sender: 'ME',
              content: 'Agree! 😃',
            },
          ], after: { delay: 3000, targetState: 'danielSaysOk' },
        },
        danielSaysOk: {
          messages: [
            {
              sender: botUserIds.daniel,
              content: 'Me too! 👍',
            },
          ], after: { delay: 3000, targetState: 'splitBills' },
        },
        splitBills: {
          messages: [
            {
              sender: botUserIds.hailey,
              //customType: messageCustomTypes.splitPayment,
              content: '$200 to be split with all of us.',
              data: { cover: '', actions: [{ label: 'Split Now', variant: 'light' }] }
            },
          ],

          async onActionPress(data, { transitionState }) {
            const { channelUrl } = data.message;
            try {
              await inviteUser(channelUrl, botUserIds.supportBot);
              await sendMessageAndTranslate(
                channelUrl, {
                message_type: 'MESG',
                user_id: botUserIds.hailey,
                message: 'Split $200 in 4 friends with a share of $50 each.',
              },
              ),
                transitionState('alexSaysThanks');
            } catch (error) {
              logError(error);
            }
          },
        },
        alexSaysThanks: {
          messages: [
            {
              sender: 'ME',
              content: 'Thanks! 😃',
            },
          ],
        },
      }, //state
    }, //channel
  ],
};
