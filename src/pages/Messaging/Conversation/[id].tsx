import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Input, Button, InputGroup, InputGroupAddon, Container} from "reactstrap";
import messaging from "../../../utils/api/messaging";
import {getLoggedUserId} from "../../../utils/getLoggedUserId";
import Link from "next/link";
import users from "../../../utils/api/users";
import moment from "moment";

export const Id = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [allUsers, setUsers] = useState({});
  const [conversation, setConversation] = useState({senderId: 0, recipientId: 0, lastMessageTimestamp: 0});
  const [userNickname, setUser] = useState('Utilisateur');
  const router = useRouter()
  const {query: { id }} = router;
  const meId = getLoggedUserId();

  useEffect(() => {
    if (!!id)
      fetchConversation();
    else
      router.push('/');
  }, []);

  const fetchConversation = async () => {
    try {
      const [resConversations, resMessages, resUsers] = await Promise.all([
        messaging.conversations.getAllConversations(),
        messaging.messages.getAllMessages({id}),
        users.getAllUsers()
      ]);

      const newConversation = resConversations.find(c => c.id === Number(id));

      setMessages(resMessages);
      setConversation(newConversation);
      setUser(meId === newConversation.senderId ? newConversation.recipientNickname : newConversation.senderNickname);
      setUsers(resUsers.reduce((acc, curr) => {
        acc[curr.id] = curr;

        if (curr.id !== meId && (conversation.senderId === curr.id || conversation.recipientId === curr.id)) {
          setUser(curr);
        }

        return acc;
      }, {}));
      setLoading(false);
    } catch {
      alert('Une erreur est survenue');
    }
  };

  const sendMessage = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const response = await messaging.messages.sendMessage({conversationId: id, message: message});

      setMessages([...messages, {...response, authorId: meId, conversationId: id}]);
      setMessage('');
      setConversation({...conversation, lastMessageTimestamp: Number(moment().format('X'))})
    } catch {
      alert('Une erreur est survenue');
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await messaging.messages.deleteMessage({messageId: messageId});
    } catch {
      alert('Une erreur est survenue');
    }
  };

  return (
    <Container>
      {!!loading && <div>Loading...</div>}
      {!loading &&
        <>
          <div className="header-conversation">
            <Link href={'/'}><span className="fa fa-arrow-left back-span"/></Link>
            <span className="ml-2">{userNickname} - You</span>
            <span className="float-right hide-mobile">Last message {moment(conversation.lastMessageTimestamp * 1000).fromNow()}</span>
          </div>

          <div className="chat">
            <div className="wrapper">
              {messages.sort((a, b) => b.timestamp - a.timestamp).map(m => {
                if (m.authorId === meId) {
                  return (
                    <div key={m.id}>
                      <div className="line-me">
                        <div className="myMessage">{m.body}</div>
                      </div>
                    </div>
                  )
                }
                else {
                  return (
                    <div key={m.id}>
                      <div className="line-other">
                        <h5 className="senderName">{allUsers[m.authorId].nickname}</h5>
                        <div className="otherMessage">{m.body}</div>
                      </div>
                    </div>
                  )
                }
              })}
            </div>
          </div>

          <div>
            <form onSubmit={sendMessage}>
              <InputGroup className="position-relative">
                <Input
                  type="text"
                  value={message}
                  className="text-message"
                  placeholder="Send message"
                  onChange={({target}) => setMessage(target.value)}/>
                <InputGroupAddon addonType="prepend">
                  <Button type='submit' onClick={sendMessage} color="transparent" className="button-send">
                    <span className="fa fa-paper-plane"/>
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </div>
        </>}
    </Container>
  )
};

export default Id;