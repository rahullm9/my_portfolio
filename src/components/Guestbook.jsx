import React, { useState, useEffect } from 'react';
import { FiGithub } from 'react-icons/fi';
import { auth, githubProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const Guestbook = ({ isHome, setActiveSection }) => {
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('write');
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);

  useEffect(() => {
    // Check if Firebase is hooked up
    if (import.meta.env.VITE_FIREBASE_API_KEY) {
      setIsFirebaseConfigured(true);

      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser({
            author: user.reloadUserInfo?.screenName || user.displayName || user.email?.split('@')[0] || "Guest",
            avatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.email || 'G'}`
          });
        } else {
          setCurrentUser(null);
        }
      });

      // Fetch from new Node backend
      fetch('http://localhost:5000/api/guestbook')
        .then(res => {
          if (!res.ok) throw new Error('API Error');
          return res.json();
        })
        .then(data => {
          const fetchedComments = data.map(comment => ({
            ...comment,
            date: comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US')
          }));
          setComments(fetchedComments);
        })
        .catch(error => {
          console.warn("Backend error, falling back to local storage.", error);
          loadLocalComments();
        });

      return () => {
        unsubscribeAuth();
      };
    } else {
      // Firebase not configured yet, fallback to localStorage mock
      loadLocalComments();
      const user = localStorage.getItem('guestbook_user');
      if (user) setCurrentUser(JSON.parse(user));
    }
  }, []);

  const loadLocalComments = () => {
    const saved = localStorage.getItem('guestbook_comments');
    setComments(saved ? JSON.parse(saved) : []);
  };

  const handleLogin = async () => {
    if (isFirebaseConfigured) {
      try {
        await signInWithPopup(auth, githubProvider);
      } catch (error) {
        console.error("GitHub Login Error:", error);
        alert("GitHub Login failed! Check console or Firebase config.");
      }
    } else {
      // Mock Login if .env isn't set up yet
      alert("Note: Firebase is not configured (.env.local missing). Proceeding with a mock GitHub profile just for testing the UI locally.");
      const fakeUser = {
        author: "guest_user",
        avatar: "https://avatars.githubusercontent.com/u/9919?v=4"
      };
      setCurrentUser(fakeUser);
      localStorage.setItem('guestbook_user', JSON.stringify(fakeUser));
    }
  };

  const handleLogout = () => {
    if (isFirebaseConfigured) {
      signOut(auth);
    } else {
      setCurrentUser(null);
      localStorage.removeItem('guestbook_user');
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !currentUser) return;

    if (isFirebaseConfigured) {
      try {
        const response = await fetch('http://localhost:5000/api/guestbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: currentUser.author,
            avatar: currentUser.avatar,
            text: newComment
          })
        });

        if (!response.ok) throw new Error('Failed to post');

        const newDoc = await response.json();
        const newCommentObj = {
          ...newDoc,
          id: newDoc._id,
          date: newDoc.createdAt ? new Date(newDoc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US')
        };

        setComments([...comments, newCommentObj]);
        setNewComment('');
      } catch (error) {
        console.error("Error posting to backend: ", error);
        alert("Could not post comment. Is the backend running?");
      }
    } else {
      // LocalStorage fallback
      const comment = {
        id: Date.now(),
        author: currentUser.author,
        avatar: currentUser.avatar,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        text: newComment
      };
      const updated = [...comments, comment];
      setComments(updated);
      localStorage.setItem('guestbook_comments', JSON.stringify(updated));
      setNewComment('');
    }
  };

  const displayComments = isHome ? comments.slice(-3) : comments;

  return (
    <div id="guestbook" className="w-full mt-10 md:mt-32 mb-10 max-w-[1000px] mx-auto">
      <h2 className="text-2xl font-bold font-sans tracking-tight mb-8 text-gray-900 dark:text-white transition-colors duration-300 border-b border-gray-200 dark:border-white/10 pb-4">
        Guestbook
      </h2>

      {/* Comments List */}
      <div className="space-y-6 mb-8 pl-2">
        {displayComments.map((comment, index) => (
          <div key={comment._id || comment.id || index} className="flex gap-4">
            <img src={comment.avatar} alt={comment.author} className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex-shrink-0" />
            <div className="flex-1 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] overflow-hidden transition-colors duration-300 shadow-sm dark:shadow-none">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111] transition-colors duration-300">
                <span className="font-semibold text-gray-900 dark:text-gray-200 text-[15px]">{comment.author}</span>
                <span className="text-gray-500 dark:text-gray-400 text-[13px] ml-2 font-medium">commented on {comment.date}</span>
              </div>
              <div className="p-4 text-gray-800 dark:text-gray-300 text-[15px] leading-relaxed transition-colors duration-300 whitespace-pre-wrap">
                {comment.text}
              </div>
            </div>
          </div>
        ))}

        {isHome && (
          <div className="flex justify-end pt-2 pb-6">
            <button
              onClick={() => {
                if (setActiveSection) {
                  setActiveSection('Guestbook');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="text-[15px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 group"
            >
              See all comments
              <span className="transform transition-transform text-xl leading-none group-hover:translate-x-1">→</span>
            </button>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="flex gap-4 pl-2">
        {currentUser ? (
          <img src={currentUser.avatar} alt="You" className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex-shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#222] flex items-center justify-center flex-shrink-0">
            <FiGithub className="text-gray-500 dark:text-gray-400" />
          </div>
        )}

        <div className="flex-1 border border-gray-300 dark:border-white/20 rounded-md overflow-hidden bg-white dark:bg-[#0a0a0a] transition-colors duration-300 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
          <div className="flex items-center gap-2 px-3 pt-2 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111] transition-colors duration-300">
            <button
              onClick={() => setActiveTab('write')}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors duration-300 ${activeTab === 'write' ? 'border-primary text-gray-900 dark:text-gray-100' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Write
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors duration-300 ${activeTab === 'preview' ? 'border-primary text-gray-900 dark:text-gray-100' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Preview
            </button>
          </div>

          <div className="p-2 bg-white dark:bg-[#0a0a0a]">
            {activeTab === 'write' ? (
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Leave a comment"
                className="w-full min-h-[120px] p-2 bg-transparent text-gray-900 dark:text-gray-200 resize-y outline-none placeholder-gray-500 dark:placeholder-gray-500 transition-colors duration-300 font-sans text-[15px] whitespace-pre-wrap"
              />
            ) : (
              <div className="min-h-[120px] p-2 text-gray-900 dark:text-gray-200 transition-colors duration-300 text-[15px] whitespace-pre-wrap">
                {newComment ? newComment : 'Nothing to preview'}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111] transition-colors duration-300">
            <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 hidden sm:inline-block">Styling with Markdown is supported</span>
            <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 sm:hidden">Markdown supported</span>
            {currentUser ? (
              <div className="flex gap-4 items-center">
                <button onClick={handleLogout} className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                  Sign out
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!newComment.trim()}
                  className="px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comment
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-[14px] font-semibold rounded-md transition-colors shadow-sm"
              >
                <FiGithub size={16} /> Sign in with GitHub
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guestbook;
