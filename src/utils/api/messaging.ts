import {post, get, remove} from "../helpers/api";
import {getLoggedUserId} from "../getLoggedUserId";
import moment from "moment";

export const messaging = {
  conversations: {
    getAllConversations: () => {
      const id = getLoggedUserId();

      return get(`http://localhost:3005/conversations/${id}`);
    },
    createConversation: ({recipientId}) => {
      const id = getLoggedUserId();

      return post(`http://localhost:3005/conversations/${id}`, {recipientId});
    },
    deleteConversation: ({id}) => {
      return remove(`http://localhost:3005/conversation/${id}`)
    }
  },
  messages: {
    getAllMessages: ({id}) => {
      return get(`http://localhost:3005/messages/${id}`);
    },
    sendMessage: ({conversationId, message}) => {
      return post(`http://localhost:3005/messages/${conversationId}`, {
        body: message,
        timestamp: moment().valueOf()
      });
    },
    deleteMessage: ({messageId}) => {
      return remove(`http://localhost:3005/message/${messageId}`);
    }
  }
}

export default messaging;