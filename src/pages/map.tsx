import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ArrowLeft } from 'lucide-react';
import { AuthContext } from '@/pages/_app';

const nodes = [
  { id: 'llm-basics', title: 'Basics of LLMs', description: 'Understand the foundation of Large Language Models.', x: 50, y: 80, locked: false },
  { id: 'prompt-engineering', title: 'Prompt Engineering', description: 'Master the art of crafting effective prompts.', x: 30, y: 50, locked: true },
  { id: 'rag-systems', title: 'RAG Systems', description: 'Build Retrieval-Augmented Generation architectures.', x: 70, y: 50, locked: true },
  { id: 'fine-tuning', title: 'Fine-Tuning', description: 'Adapt models to specific domains and tasks.', x: 50, y: 20, locked: true },
];

export default function Map() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Quick auth check
  useEffect(() => {
    if (user === null) router.push('/auth');
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950 p-8 relative overflow-hidden flex flex-col">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-950 to-gray-950" />
      <div className="absolute top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full flex-grow flex flex-col">
        
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Hub</span>
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            The World Map
          </h1>
        </div>

        <div className="flex-grow relative border border-gray-800 rounded-3xl bg-gray-900/50 backdrop-blur-sm p-8 shadow-2xl">
          {/* Path connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 8px rgba(56,189,248,0.3))' }}>
            <path d="M 50% 80% L 30% 50%" stroke="#374151" strokeWidth="3" strokeDasharray="8 8" />
            <path d="M 50% 80% L 70% 50%" stroke="#374151" strokeWidth="3" strokeDasharray="8 8" />
            <path d="M 30% 50% L 50% 20%" stroke="#374151" strokeWidth="3" strokeDasharray="8 8" />
            <path d="M 70% 50% L 50% 20%" stroke="#374151" strokeWidth="3" strokeDasharray="8 8" />
          </svg>

          {nodes.map(node => (
            <motion.div
              key={node.id}
              className="absolute group"
              style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedNode(node)}
            >
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-xl transition-all
                ${node.locked 
                  ? 'bg-gray-800 border-4 border-gray-700 text-gray-500' 
                  : 'bg-gradient-to-br from-amber-400 to-orange-500 border-4 border-white text-white shadow-amber-500/50'}
              `}>
                {node.locked ? <Lock size={24} /> : <Unlock size={24} />}
              </div>
              <div className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${node.locked ? 'bg-gray-800 text-gray-400' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                  {node.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quest Modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                {selectedNode.locked ? <Lock size={150} /> : <Unlock size={150} />}
              </div>

              <div className="relative z-10">
                <div className={`inline-block p-3 rounded-xl mb-6 ${selectedNode.locked ? 'bg-gray-800 text-gray-500' : 'bg-amber-500/20 text-amber-500'}`}>
                  {selectedNode.locked ? <Lock size={24} /> : <Unlock size={24} />}
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">{selectedNode.title}</h2>
                <p className="text-gray-400 mb-8">{selectedNode.description}</p>
                
                {selectedNode.locked ? (
                  <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    This node is locked until you prove your base knowledge. Complete prerequisite quests to unlock.
                  </div>
                ) : (
                  <button 
                    onClick={() => router.push(`/quests/${selectedNode.id}`)}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow"
                  >
                    Embark on Quest
                  </button>
                )}
                
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="w-full mt-4 py-3 rounded-lg bg-gray-800 text-gray-300 font-semibold hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
