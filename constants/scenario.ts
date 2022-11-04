import { inviteUser, leaveChannel, sendMessage } from '../api/platformAPI';
import { parseMessageData } from '../utils/dataUtils';
import logError from '../utils/logError';
import { botUserIds } from './botUsers';
import { channelCustomTypes, messageCustomTypes } from './common';
import { sendMessageAndTranslate } from '../api/utils';


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
              content: 'Hello Alex, I am SendBot. Welcome to SendFood’s Customer Support. How can I help you today?',
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
            content: 'Please confirm that you have read and agreed with SendFood’s Data Privacy Policy here https://www.sendfood.com/privacy',
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
              customType: messageCustomTypes.orderConfirmation,
              content: 'Hi Alex, is this the order that you would like enquire about?',
              data: {
                orderInfo: {
                  price: '$30.10',
                  product: 'Marinara',
                  paymentMethod: 'AMEX ****0001',
                  address: '400 1st Ave, San Mateo',
                  localImageName: 'orderConfirmation.png',
                  title: 'Order Id: #0000-1111',
                },
              },
            },
          ],
          after: { targetState: 'AlexReplies2' },
        },
        AlexReplies2: {
          suggestedReplies: [['Yes', 'AlexReplies2_1'], 'No'],
        },
        AlexReplies2_1: {
          messages:[
          ],after: { delay: 1000, targetState: 'agentConfirmed' },
        },
        agentConfirmed: {
          messages:[
            
              {
                sender: botUserIds.supportBot,
                content: 'Thank you for the confirmation',
              },
          ],after: { delay: 3000, targetState: 'AlexReplies3' },
        },
        AlexReplies3: {
          messages: [
            {
              sender: 'ME',
              content: 'The delivery was terribly late today!',
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
                'Hey Alex, I see you’re having issue with your delivery.',
            },
          ],
          after: { delay : 2000 ,targetState: 'agentConnected1' },
        },
        agentConnected1: {
          messages: [
            {
              sender: botUserIds.daniel,
              content:
                ' We’d like to cover the cost of this order to make up for the inconvenience.',
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
          ],after: { delay: 1000, targetState: 'agentSendVoucher' },
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

          async onActionPress(data, {transitionState}) {
            const { channelUrl } = data.message;
            try {
              await inviteUser(channelUrl, botUserIds.supportBot);
              await sendMessageAndTranslate(
                channelUrl, {
                  message_type: 'MESG',
                  user_id: botUserIds.supportBot,
                  message:  '🎉 Congratulation!!! 🎉\nYou have successfully claimed your $30 SendFood voucher.',
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
          after: { delay:2000, targetState: 'byeFromDaniel' },
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
              customType: messageCustomTypes.csat5,
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
      name: 'SendFood',
      customType: channelCustomTypes.fooddelivery,
      members: [botUserIds.casey],
      states: {
        initial: {
          messages: [
            {
              sender: 'ME',
              content: 'Hey, any update on arrival time?',
              createdAt:'-35m'
            },
            {
              sender: botUserIds.casey,
              customType: messageCustomTypes.audio,
              content: {
                url: 'https://dxstmhyqfqr1o.cloudfront.net/inbox-demo/uploads/voicememo.m4a',
                // url: 'https://drive.google.com/file/d/1qQEpCSgINn8k2D60jExAtz444kJXnlk4/preview',
                type: 'audio/mp3',
              },
              createdAt: '-32m',
            },
           
          ],
          onChannelEnter(context) {
            context.transitionState('driverReplies1');
          },
        }, //individual state
        driverReplies1: {
          messages: [
            {
              sender: botUserIds.casey,
              content: 'I am still quite some distance away',
              createdAt:'-30m',
            },
          ],
          after: { delay: 3000,  targetState: 'driverReplies1_1' },
        },
        driverReplies1_1: {
          messages: [
            {
              sender: botUserIds.casey,
              customType: messageCustomTypes.map,
              content: 'ETA 30 mins',
              createdAt:'-30m',
            },
          ],
          after: { delay: 4000,  targetState: 'alexReplies1' },
        },
        alexReplies1: {
          messages: [
            {
              sender: 'ME',
              content: 'So far away??? what the fuck!!!',
              createdAt:'-29m',
            },
          ],
          after: { delay: 3000, targetState: 'driverReplies2' },
        },
        driverReplies2: {
          messages: [
            {
              sender: botUserIds.casey,
              content: 'yeah, sorry traffic was terrible. I am approaching your street now',
            },
          ], after: { delay: 3000, targetState: 'driverReplies2_2' }, 
        },
        driverReplies2_2: {
          messages: [
            {
              sender: botUserIds.casey,
              content: 'I am at your building now, waiting at the reception front desk',
            },
          ], after: { delay: 3000, targetState: 'driverReplies3' }, 
        },
        driverReplies3: {
          messages: [
            {
              sender: botUserIds.casey,
              content: {
                url: 'https://lh3.googleusercontent.com/R_JwvfGK0uDZsG3P3eq-zElMv_lpTV-AGAzk8na2NZ-stisI22dwg66ifcCYD51CzM4=w2400',
                type: 'image/jpg',
              },
                
            },

          ],  after: { delay: 3000,  targetState: 'alexReplies2' }, 
        },
        alexReplies2: {
          messages: [
            {
              sender: "ME",
              content: 'Ok, I will come to pick it up',
              reactions: [{ emoji: '+1', userIds: [botUserIds.casey] }],
            },
          ],
          after: { delay: 3000, targetState: 'driverReplies4' },
        },
        driverReplies4: {
          messages: [
            {
              sender: botUserIds.casey,
              content: 'Thank you',
            },
            {
              sender: botUserIds.casey,
              content: 'Sorry about the delay',
            },
          ], after: { delay: 3000,  targetState: 'alexReplies3' }, 
        },
        alexReplies3: {
          messages: [
            {
              sender: 'ME',
              content: '😡',
            },
          ],
        },
      }, //state
    }, //channel
  ],
};
