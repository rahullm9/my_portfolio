import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';

const Guestbook = ({ isHome, setActiveSection }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('write');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Fetch real-time comments from Firestore
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US')
        };
      });
      setComments(fetchedComments);
    }, (error) => {
      console.error("Firestore Fetch Error:", error);
      loadLocalComments();
    });

    // 2. Load saved guest info from localStorage
    const savedName = localStorage.getItem('guestbook_name');
    const savedEmail = localStorage.getItem('guestbook_email');
    if (savedName) setGuestName(savedName);
    if (savedEmail) setGuestEmail(savedEmail);

    return () => unsubscribe();
  }, []);

  const loadLocalComments = () => {
    const saved = localStorage.getItem('guestbook_comments');
    setComments(saved ? JSON.parse(saved) : []);
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !guestName.trim()) return;
    
    setIsSubmitting(true);
    // Save info to localStorage for next time
    localStorage.setItem('guestbook_name', guestName);
    localStorage.setItem('guestbook_email', guestEmail);

    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(guestName)}&background=random`;

    try {
      // Add document to Firestore
      await addDoc(collection(db, 'guestbook'), {
        author: guestName,
        email: guestEmail,
        avatar: avatar,
        text: newComment,
        createdAt: serverTimestamp()
      });

      setNewComment('');
    } catch (error) {
      console.error("Error posting to Firestore: ", error);
      alert(`Could not post comment: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
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
        <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-[#111]">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(guestName || 'G')}&background=random`} 
            alt="You" 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="flex-1 border border-gray-300 dark:border-white/20 rounded-md overflow-hidden bg-white dark:bg-[#0a0a0a] transition-colors duration-300 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
          <div className="p-4 space-y-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#111]/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">Name</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your name"
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-[#050505] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-[#050505] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

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
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !newComment.trim() || !guestName.trim()}
              className="px-6 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guestbook;
