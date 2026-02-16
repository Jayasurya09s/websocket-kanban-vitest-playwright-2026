import { useEffect, useState } from "react";
import socket from "../api/socket";
import { useDrop } from "react-dnd";
import { motion } from "framer-motion";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";
import UploadModal from "./UploadModal";

const columns=[
  {id:"todo",title:"To Do"},
  {id:"in-progress",title:"In Progress"},
  {id:"done",title:"Done"}
];

export default function KanbanBoard(){
  const [tasks,setTasks]=useState([]);
  const [open,setOpen]=useState(false);
  const [uploadTask,setUploadTask]=useState(null);

  useEffect(()=>{
    const handleSync = (data) => setTasks(data);
    const handleCreate = (t) => setTasks((p) => [t, ...p]);
    const handleDelete = (id) => setTasks((p) => p.filter((x) => x._id !== id));
    const handleMove = (u) => setTasks((p) => p.map((t) => (t._id === u._id ? u : t)));
    const handleUpdate = (u) => setTasks((p) => p.map((t) => (t._id === u._id ? u : t)));
    const handleAttachment = ({ taskId, attachment }) =>
      setTasks((p) =>
        p.map((t) =>
          t._id === taskId
            ? { ...t, attachments: [...(t.attachments || []), attachment] }
            : t
        )
      );

    socket.emit("sync:tasks");

    socket.on("sync:tasks", handleSync);
    socket.on("task:created", handleCreate);
    socket.on("task:deleted", handleDelete);
    socket.on("task:moved", handleMove);
    socket.on("task:updated", handleUpdate);
    socket.on("attachment:added", handleAttachment);

    return () => {
      socket.off("sync:tasks", handleSync);
      socket.off("task:created", handleCreate);
      socket.off("task:deleted", handleDelete);
      socket.off("task:moved", handleMove);
      socket.off("task:updated", handleUpdate);
      socket.off("attachment:added", handleAttachment);
    };
  },[]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Board</p>
          <h2 className="text-2xl font-semibold text-indigo-200">Main Sprint</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge">{tasks.length} tasks</span>
          <button onClick={() => setOpen(true)} className="btn-primary glow">
            New task
          </button>
        </div>
      </div>

      <div className="h-full flex gap-6 overflow-x-auto pb-4">
        {columns.map((col) => (
          <Column key={col.id} col={col} tasks={tasks} openUpload={setUploadTask} />
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-10 right-10 w-14 h-14 rounded-full bg-indigo-600 glow text-2xl"
        aria-label="Create task"
      >
        +
      </motion.button>

      <CreateTaskModal open={open} onClose={() => setOpen(false)} />
      <UploadModal task={uploadTask} close={() => setUploadTask(null)} />
    </div>
  );
}

function Column({col,tasks,openUpload}){
  const [,drop]=useDrop(()=>({
    accept:"TASK",
    drop:(item)=>{
      socket.emit("task:move",{taskId:item.id,column:col.id});
    }
  }));

  return (
    <div ref={drop} className="min-w-[320px] flex-1">
      <div className="glass rounded-2xl p-4 h-full border border-white/10">
        <div className="flex justify-between mb-4">
          <h2 className="text-indigo-300 font-semibold">{col.title}</h2>
          <div className="text-xs text-gray-400">
            {tasks.filter((t) => t.column === col.id).length}
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-[500px]">
          {tasks.filter((t) => t.column === col.id).map((t) => (
            <TaskCard key={t._id} task={t} openUpload={openUpload} />
          ))}
        </div>
      </div>
    </div>
  );
}
