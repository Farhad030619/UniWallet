import React, { useState, useRef } from 'react';
import type { Post } from '../types';
import { PlusIcon, XIcon, ImageIcon } from './icons';

interface NewPostModalProps {
  onClose: () => void;
  onPost: (post: { text: string; imageUrl?: string }) => void;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ onClose, onPost }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_CHARS = 280;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!text.trim()) return;
    onPost({ text, imageUrl: image || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-lg p-6 space-y-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-center">Create a new post</h2>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={MAX_CHARS}
          className="w-full h-32 p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
        <div className="text-right text-sm text-gray-500 dark:text-gray-400">
          {text.length} / {MAX_CHARS}
        </div>

        {image && (
          <div className="relative">
            <img src={image} alt="Preview" className="w-full max-h-60 object-cover rounded-lg" />
            <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1">
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-full">
            <ImageIcon className="w-6 h-6" />
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </button>
          <button 
            onClick={handlePost} 
            disabled={!text.trim()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

interface CommunityViewProps {
  posts: Post[];
  addPost: (post: { text: string; imageUrl?: string }) => void;
}

const CommunityView: React.FC<CommunityViewProps> = ({ posts, addPost }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {isModalOpen && <NewPostModal onClose={() => setIsModalOpen(false)} onPost={addPost} />}

      <div className="p-4 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Feed</h1>
          <p className="text-gray-500 dark:text-gray-400">Share tips and motivation with fellow students.</p>
        </header>
        
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="p-4">
                <div className="flex items-center space-x-3">
                  <img className="w-12 h-12 rounded-full object-cover" src={post.authorAvatar} alt={post.author} />
                  <div>
                    <p className="font-bold">{post.author}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{post.createdAt}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.text}</p>
                 {post.imageUrl && (
                    <img className="mt-4 w-full h-auto max-h-[60vh] object-cover rounded-lg" src={post.imageUrl} alt="Post content" />
                )}
              </div>
              <div className="p-4 flex justify-start space-x-6 border-t border-gray-200 dark:border-gray-700">
                 <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-500 transition">
                   <span>❤️</span>
                   <span className="text-sm font-semibold">{post.likes}</span>
                 </button>
                 <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition">
                   <span>💬</span>
                   <span className="text-sm font-semibold">{post.comments}</span>
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-5 bg-gradient-to-br from-blue-500 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 active:scale-95 z-40"
        aria-label="Create new post"
      >
        <PlusIcon className="w-8 h-8" />
      </button>
    </>
  );
};

export default CommunityView;