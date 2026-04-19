import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

const Guestbook = ({ isHome, setActiveSection }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('write');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    // Load saved guest info from localStorage
    const savedName = localStorage.getItem('guestbook_name');
    const savedEmail = localStorage.getItem('guestbook_email');
    if (savedName) setGuestName(savedName);
    if (savedEmail) setGuestEmail(savedEmail);

    // Fetch comments from MongoDB via API
    fetch(`${API_URL}/api/guestbook`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        const fetchedComments = data.map(comment => ({
          ...comment,
          id: comment._id,
          date: comment.createdAt
            ? new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : new Date().toLocaleDateString('en-US'),
        }));
        setComments(fetchedComments);
      })
      .catch(err => {
        console.error('Failed to load comments:', err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const isValidEmail = (email) => {
    if (!email) return true; // optional field
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setGuestEmail(val);
    if (val && !isValidEmail(val)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !guestName.trim()) return;
    if (guestEmail && !isValidEmail(guestEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    localStorage.setItem('guestbook_name', guestName);
    localStorage.setItem('guestbook_email', guestEmail);

    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(guestName)}&background=random`;

    try {
      const response = await fetch(`${API_URL}/api/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: guestName, email: guestEmail, avatar, text: newComment }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const newDoc = await response.json();
      const newCommentObj = {
        ...newDoc,
        id: newDoc._id,
        date: newDoc.createdAt
          ? new Date(newDoc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : new Date().toLocaleDateString('en-US'),
      };

      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert(`Could not post comment: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayComments = isHome ? comments.slice(0, 3) : comments;

  return (
    <div id="guestbook" className="w-full mt-10 md:mt-32 mb-10 max-w-[1000px] mx-auto">
      <h2 className="text-2xl font-bold font-sans tracking-tight mb-8 text-gray-900 dark:text-white transition-colors duration-300 border-b border-gray-200 dark:border-white/10 pb-4">
        Guestbook
      </h2>

      {/* Comments List */}
      <div className="space-y-6 mb-8 pl-2">
        {isLoading ? (
          <div className="text-gray-400 dark:text-gray-500 text-sm py-4">Loading comments…</div>
        ) : displayComments.length === 0 ? (
          <div className="text-gray-400 dark:text-gray-500 text-sm py-4">No comments yet. Be the first!</div>
        ) : (
          displayComments.map((comment, index) => (
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
          ))
        )}

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
        <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-[#111]">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(guestName || 'G')}&background=random`}
            alt="You"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 border border-gray-300 dark:border-white/20 rounded-md overflow-hidden bg-white dark:bg-[#0a0a0a] transition-colors duration-300 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
          {/* Name + Email */}
          <div className="p-4 space-y-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#111]/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">Name</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="Your name"
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-[#050505] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  Email <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={handleEmailChange}
                  placeholder="your@email.com"
                  className={`px-3 py-2 text-sm rounded-md border bg-white dark:bg-[#050505] text-gray-900 dark:text-white focus:outline-none focus:ring-1 transition-all shadow-sm ${
                    emailError
                      ? 'border-red-400 dark:border-red-500 focus:ring-red-400'
                      : 'border-gray-300 dark:border-white/10 focus:ring-primary'
                  }`}
                />
                {emailError && (
                  <span className="text-[12px] text-red-500 ml-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {emailError}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Write / Preview tabs */}
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

          {/* Textarea / Preview */}
          <div className="p-2 bg-white dark:bg-[#0a0a0a]">
            {activeTab === 'write' ? (
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Leave a comment"
                className="w-full min-h-[120px] p-2 bg-transparent text-gray-900 dark:text-gray-200 resize-y outline-none placeholder-gray-500 dark:placeholder-gray-500 transition-colors duration-300 font-sans text-[15px] whitespace-pre-wrap"
              />
            ) : (
              <div className="min-h-[120px] p-2 text-gray-900 dark:text-gray-200 transition-colors duration-300 text-[15px] whitespace-pre-wrap">
                {newComment || 'Nothing to preview'}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111] transition-colors duration-300">
            <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 hidden sm:inline-block">Markdown supported</span>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !newComment.trim() || !guestName.trim() || !!emailError}
              className="px-6 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? 'Posting…' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guestbook;
