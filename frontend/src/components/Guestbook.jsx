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
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showForm, setShowForm] = useState(false);

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

  const isValidFormat = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  // Debounce ref to avoid firing on every keystroke
  const emailDebounceRef = React.useRef(null);

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setGuestEmail(val);
    setEmailVerified(false);

    if (!val) {
      setEmailError('');
      setEmailChecking(false);
      clearTimeout(emailDebounceRef.current);
      return;
    }

    if (!isValidFormat(val)) {
      setEmailError('Please enter a valid email address');
      setEmailChecking(false);
      clearTimeout(emailDebounceRef.current);
      return;
    }

    // Format looks good — check existence after 800ms pause
    setEmailError('');
    setEmailChecking(true);
    clearTimeout(emailDebounceRef.current);
    emailDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.eva.pingutil.com/email?email=${encodeURIComponent(val)}`
        );
        const data = await res.json();
        const d = data?.data;
        if (d?.valid_syntax && d?.domain_exists && d?.valid_mx_records) {
          setEmailError('');
          setEmailVerified(true);
        } else {
          setEmailVerified(false);
          setEmailError(
            d?.disposable
              ? 'Disposable email addresses are not allowed'
              : 'This email address does not exist or cannot receive mail'
          );
        }
      } catch {
        // If the checker fails (network issue), fall back to format-only
        setEmailVerified(true);
        setEmailError('');
      } finally {
        setEmailChecking(false);
      }
    }, 800);
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !guestName.trim()) return;
    if (guestEmail && (!isValidFormat(guestEmail) || emailError)) {
      setEmailError(emailError || 'Please enter a valid email address');
      return;
    }
    if (emailChecking) return; // still verifying

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
      setGuestEmail('');
      setEmailError('');
      setEmailVerified(false);
      setShowForm(false);
    } catch (error) {
      console.error('Error posting comment:', error);
      alert(`Could not post comment: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReaction = async (commentId, type) => {
    const reactionKey = `reacted_${commentId}_${type}`;
    if (localStorage.getItem(reactionKey)) return; // Prevent spam

    // Optimistically update UI
    setComments(prev => prev.map(c => {
      if ((c._id || c.id) === commentId) {
        return {
          ...c,
          reactions: {
            ...c.reactions,
            [type]: (c.reactions?.[type] || 0) + 1
          }
        };
      }
      return c;
    }));

    localStorage.setItem(reactionKey, 'true');

    // Send update to backend
    try {
      const response = await fetch(`${API_URL}/api/guestbook`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId, reactionType: type })
      });
      if (!response.ok) throw new Error('Reaction failed');
    } catch (error) {
      console.error(error);
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
                {/* Reactions Bar */}
                <div className="px-4 py-2 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#111]/50 flex gap-2">
                  {[
                    { type: 'like', emoji: '👍' },
                    { type: 'heart', emoji: '❤️' },
                    { type: 'rocket', emoji: '🚀' }
                  ].map(({ type, emoji }) => {
                    const count = comment.reactions?.[type] || 0;
                    const hasReacted = localStorage.getItem(`reacted_${comment._id || comment.id}_${type}`);
                    return (
                      <button
                        key={type}
                        onClick={() => handleReaction(comment._id || comment.id, type)}
                        disabled={!!hasReacted}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-medium transition-all ${
                          hasReacted 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#222]'
                        }`}
                      >
                        <span className="text-sm">{emoji}</span>
                        {count > 0 && <span>{count}</span>}
                      </button>
                    )
                  })}
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

      {/* Toggle Button or Form */}
      {!showForm ? (
        <div className="flex justify-end pl-2 mt-2">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Post a Comment
          </button>
        </div>
      ) : (
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
                  <div className="relative">
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={handleEmailChange}
                      placeholder="your@email.com"
                      className={`w-full px-3 py-2 pr-9 text-sm rounded-md border bg-white dark:bg-[#050505] text-gray-900 dark:text-white focus:outline-none focus:ring-1 transition-all shadow-sm ${
                        emailError
                          ? 'border-red-400 dark:border-red-500 focus:ring-red-400'
                          : emailVerified
                          ? 'border-green-400 dark:border-green-500 focus:ring-green-400'
                          : 'border-gray-300 dark:border-white/10 focus:ring-primary'
                      }`}
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      {emailChecking && (
                        <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                      {!emailChecking && emailVerified && (
                        <svg className="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {!emailChecking && emailError && (
                        <svg className="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  {emailChecking && <span className="text-[12px] text-gray-400 ml-1">Verifying email…</span>}
                  {!emailChecking && emailVerified && <span className="text-[12px] text-green-500 ml-1">✓ Email verified</span>}
                  {!emailChecking && emailError && <span className="text-[12px] text-red-500 ml-1">{emailError}</span>}
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
                  autoFocus
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
              <button
                onClick={() => setShowForm(false)}
                className="text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || emailChecking || !newComment.trim() || !guestName.trim() || !!emailError}
                className="px-6 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? 'Posting…' : emailChecking ? 'Verifying…' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guestbook;
