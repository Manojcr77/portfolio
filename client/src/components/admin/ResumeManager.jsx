import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FiUpload, FiFileText, FiExternalLink } from "react-icons/fi"
import API from "../../utils/api"

export default function ResumeManager() {
  const [resumeUrl, setResumeUrl] = useState(null)
  const [file, setFile]           = useState(null)
  const [loading, setLoading]     = useState(false)

  useEffect(() => { fetchResume() }, [])

  const fetchResume = async () => {
    try { const res = await API.get("/resume"); if (res.data?.path) setResumeUrl(res.data.path) } catch {}
  }

  const handleUpload = async () => {
    if (!file) { toast.error("Select a PDF first"); return }
    const fd = new FormData(); fd.append("resume", file)
    setLoading(true)
    try { await API.post("/resume", fd); toast.success("Resume uploaded!"); setFile(null); fetchResume() }
    catch { toast.error("Upload failed") }
    finally { setLoading(false) }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-10">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><FiFileText /> Resume</h2>
      {resumeUrl && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <FiFileText className="text-green-600" />
          <span className="text-sm text-green-700 flex-1">Resume uploaded</span>
          <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm">View <FiExternalLink size={12} /></a>
        </div>
      )}
      <div className="flex gap-3 items-center">
        <label className="flex-1 flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-400 transition">
          <FiUpload className="text-gray-400" />
          <span className="text-sm text-gray-500">{file ? file.name : "Choose PDF file"}</span>
          <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <button onClick={handleUpload} disabled={loading} className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center gap-2">
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiUpload size={14} />}
          Upload
        </button>
      </div>
    </div>
  )
}