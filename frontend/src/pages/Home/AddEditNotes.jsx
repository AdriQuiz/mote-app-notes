import React, { useState } from 'react'
import TagInput from '../../components/TagInput'
import { MdClose } from 'react-icons/md';
import Button from '../../components/Button';
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({onClose, noteData, type, getAllNotes, showToast}) => {
    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []);
    const [error, setError] = useState(null);

    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post("/add-note", {
                title, content, tags
            });

            if(response.data && response.data.note) {
                showToast("Note added successfully");
                getAllNotes();
                onClose();
            }
        } catch (error) { 
            if(error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    }

    const editNote = async () => {
        const noteId = noteData._id;
        try {
            const response = await axiosInstance.put("/edit-note/" + noteId, {
                title, content, tags
            });

            if(response.data && response.data.note) {
                showToast("Note updated successfully");
                getAllNotes();
                onClose();
            }
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    }

    const handleAddNote = () => {
        if(!title) {
            setError("Please enter the title");
            return;
        }

        if(!content) {
            setError("Please enter the content");
            return;
        }

        setError("");

        if(type === "edit") {
            editNote();
        } else {
            addNewNote();
        }
    }

    return (
        <div className='relative p-2'>
            <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-4 -right-3 hover:bg-gray-700' onClick={onClose}>
                <MdClose className='text-xl text-slate-500' />
            </button>

            <div className='flex flex-col gap-2'>
                <label className='input-label'>TITLE</label>
                <input type="text"
                    className='text-xl input-box'
                    placeholder='Title'
                    value={title}
                    onChange={({target}) => {setTitle(target.value)}}
                />
            </div>

            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>CONTENT</label>
                <textarea type="text"
                    className='text-sm input-box'
                    placeholder='Content'
                    rows={10}
                    value={content}
                    onChange={({target}) => {setContent(target.value)}}
                />
            </div>
            <div className='mt-3'>
                <label className='input-label'>TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && (
                <p className='text-red-500 text-xs pt-4'>{error}</p>
            )}

            <Button handle={handleAddNote} content={type === "edit" ? "UPDATE" : "ADD"} />
        </div>
    )
}

export default AddEditNotes