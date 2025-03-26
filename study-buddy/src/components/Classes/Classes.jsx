import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './Classes.css';

const Classes = () => {
  const [posts, setPosts] = useState([]);
  const [question, setQuestion] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});

  const handlePost = () => {
    if (question.trim() === '') return;
    setPosts([...posts, { id: Date.now(), text: question, replies: [] }]);
    setQuestion('');
  };

  const toggleReplyInput = (id) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReplyChange = (id, value) => {
    setReplyInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleReplySubmit = (parentId) => {
    const replyText = replyInputs[parentId]?.trim();
    if (!replyText) return;

    const addReply = (items) => {
      return items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            replies: [
              ...item.replies,
              { id: Date.now(), text: replyText, replies: [] },
            ],
          };
        } else if (item.replies.length > 0) {
          return {
            ...item,
            replies: addReply(item.replies),
          };
        }
        return item;
      });
    };

    setPosts((prevPosts) => addReply(prevPosts));
    setReplyInputs((prev) => ({ ...prev, [parentId]: '' }));
    setShowReplyInput((prev) => ({ ...prev, [parentId]: false }));
  };

  const renderReplies = (replies, depth = 1) => {
    return replies.map((reply) => (
      <div key={reply.id} className="reply" style={{ marginLeft: depth * 20 }}>
        <div className="reply-text">→ {reply.text}</div>
        <button className="reply-button" onClick={() => toggleReplyInput(reply.id)}>
          Reply
        </button>
        {showReplyInput[reply.id] && (
          <div className="reply-section-row">
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyInputs[reply.id] || ''}
              onChange={(e) => handleReplyChange(reply.id, e.target.value)}
            />
            <button className="submit-reply" onClick={() => handleReplySubmit(reply.id)}>
              Post
            </button>
          </div>
        )}
        {renderReplies(reply.replies, depth + 1)}
      </div>
    ));
  };

  return (
    <>
      <Navbar />
      <div className="classes-container">
        <div className="scrollable-box">
          <h1>CSC313</h1>
          <p className="welcome-text">
            Hello! Welcome to the CSC313 Discussion Post. <br />
            Feel free to post any questions you have for the class.
          </p>

          <div className="post-input">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
            />
            <button onClick={handlePost}>Post</button>
          </div>

          <div className="discussion-posts">
  {[...posts].reverse().map((post) => (
    <div key={post.id} className="post">
      <div className="post-text">
        <p>{post.text}</p>
        <button className="reply-button" onClick={() => toggleReplyInput(post.id)}>
          Reply
        </button>

        {showReplyInput[post.id] && (
          <div className="reply-section-row">
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyInputs[post.id] || ''}
              onChange={(e) => handleReplyChange(post.id, e.target.value)}
            />
            <button className="submit-reply" onClick={() => handleReplySubmit(post.id)}>
              Post
            </button>
          </div>
        )}

        {renderReplies(post.replies)}
      </div>
    </div>
  ))}
</div>

        </div>
      </div>
    </>
  );
};

export default Classes;
