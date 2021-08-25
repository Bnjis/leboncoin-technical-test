import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router'
import moment from "moment";
import randomColor from "randomcolor";
import {Container, Card, Button} from "reactstrap";
import {Avatar} from "@material-ui/core";
import messaging from "../../utils/api/messaging";
import {getLoggedUserId} from "../../utils/getLoggedUserId";

export const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await messaging.conversations.getAllConversations();

      setConversations(response);
    } catch {}
  };

  const addConversation = async () => {

  }

  const deleteConversation = async (e, id) => {
    e.stopPropagation();

    try {
      await messaging.conversations.deleteConversation({id});
    } catch {
      alert('Une erreur est survenue');
    }
  };

  const findUser = (conversation) => {
    const meId = getLoggedUserId();

    return meId === conversation.senderId ? conversation.recipientNickname : conversation.senderNickname;
  };

  return (
    <Container className="mt-2">
      {conversations.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp).map(conversation => {
        const user = findUser(conversation);
        const lastMessageDate = moment(conversation.lastMessageTimestamp * 1000).format('MMMM YYYY');

        return (
          <Card
            body
            key={conversation.id}
            className="mb-2 flex-row card-conversation"
            onClick={() => router.push(`/Messaging/Conversation/${conversation.id}`)}>
            <Avatar className="align-self-center" style={{backgroundColor: randomColor()}}>{user[0]}</Avatar>
            <div className="w-25 text-center align-self-center d-flex flex-column">
              <span>{user}</span>
              <span className="text-muted">{lastMessageDate}</span>
            </div>
            <div className="d-block align-self-center" style={{flex: 1}}>
              <Button
                size="sm"
                color="danger"
                style={{float: 'right'}}
                onClick={e => deleteConversation(e, conversation.id)}>
                <span className="fa fa-trash"/>
              </Button>
            </div>
          </Card>
        )
      })}
    </Container>
  )
};

export default ConversationsList;