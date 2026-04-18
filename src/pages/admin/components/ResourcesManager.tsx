import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const mockResources = [
  { title: "Annual Report 2023-24", category: "Annual Report", year: 2024, size: "2.4 MB", published: true },
  { title: "NGO Registration Certificate", category: "Certificate", year: 2024, size: "340 KB", published: true },
  { title: "Audit Statement FY24", category: "Audit Report", year: 2024, size: "1.8 MB", published: false },
];

const ResourcesManager = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="global-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-text-dark">Resources</h3>
          <button onClick={() => setShowModal(true)} className="bg-yellow text-text-dark text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-yellow">
            <Plus size={14} /> Add Resource
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-teal">
              {["Title", "Category", "Year", "Size", "Published", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase text-text-light tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockResources.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                <td className="px-4 py-3 font-medium text-text-dark">{r.title}</td>
                <td className="px-4 py-3 text-text-mid">{r.category}</td>
                <td className="px-4 py-3 text-text-mid">{r.year}</td>
                <td className="px-4 py-3 text-text-light">{r.size}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${r.published ? "bg-teal-light text-teal" : "bg-background text-text-light"}`}>{r.published ? "Published" : "Draft"}</span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="text-text-light hover:text-teal transition-colors"><Pencil size={14} /></button>
                  <button className="text-text-light hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40" onClick={() => setShowModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="global-card w-full max-w-[560px]">
                <h3 className="font-semibold text-text-dark mb-6">Upload Resource</h3>
                <div className="space-y-4">
                  <input placeholder="Title" className="global-card w-full h-12 outline-none focus: text-sm" />
                  <select className="global-card w-full h-12 outline-none focus: text-sm">
                    <option>Annual Report</option>
                    <option>Audit Report</option>
                    <option>Certificate</option>
                    <option>Policy Document</option>
                  </select>
                  <input type="number" placeholder="Year" className="global-card w-full h-12 outline-none focus: text-sm" />
                  <textarea placeholder="Description" rows={3} className="global-card w-full outline-none focus: text-sm" />
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-text-light text-sm cursor-pointer hover:border-teal transition-colors">
                    Click or drag a PDF file here
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowModal(false)} className="border border-border text-text-mid px-5 py-2.5 rounded-full text-sm font-medium hover:bg-background transition-colors">Cancel</button>
                  <button className="bg-teal text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold">Upload Resource</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResourcesManager;
