import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import NoteCard from '../../components/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard';
import add_notes from "../../assets/images/add_notes.png"
import no_data from "../../assets/images/no_data.png"

const Home = () => {
  const [openEditModal, setOpenEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  });
  const [userInfo, setUserInfo] = useState(null);
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const [isSearch, setIsSearch] = useState(false);

  const [showToast, setShowToast] = useState({
    isShown: false,
    message: "",
    type: "add"
  })

  const handleCloseToast = () => {
    setShowToast({
      isShown: false,
      message: ""
    })
  };

  const handleShowToast = (message, type) => {
    setShowToast({
      isShown: true,
      message: message,
      type: type
    })
  };

  const handleEdit = (noteDetails) => {
    setOpenEditModal({isShown: true, data: noteDetails, type: "edit"});
    console.log(noteDetails);
  }

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setNotes(response.data.notes);
      }

    } catch (error) {
      console.log("An unexpected error ocurred. Please try again.");
      console.log(error);

    }
  }

  const handleDeleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if(response.data && !response.data.error) {
        handleShowToast("Note deleted succesfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message) {
        console.log("An unexpected error ocurred. Please try again");
      }
    }
  }

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query }
      });

      if(response.data && response.data.notes) {
        setIsSearch(true);
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  }

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      console.log("Response: ", response);

      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }

    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => { }
  }, [])

  return (
    <div>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
      <div className="mx-auto p-16">
        {notes.length > 0 ? (
          <div className='grid grid-cols-3 gap-4'>
          {notes.map((note) => (
            <NoteCard key={note._id} title={note.title}
              content={note.content}
              date={note.createdOn}
              tags={note.tags}
              isPinned={note.isPinned}
              onEdit={() => {handleEdit(note)}}
              onDelete={() => {handleDeleteNote(note)}}
              onPinNote={() => { }}
            />
          ))}
        </div>
        ) : (
          <EmptyCard imgSrc={isSearch ? no_data : add_notes} message={isSearch ? `Oops! No notes found matching your search.` : 
            `Start creating your first note! Click the Add Button to join thoughts, ideas and reminders. Let's go!`
          } />
        )}
      </div>

      <button className='w-16 h-16 flex items-center justify-center 
          rounded-2xl bg-blue-400 hover:bg-blue-600 absolute right-10 bottom-10'
        onClick={() => {
          setOpenEditModal({ isShown: true, type: "add", data: null })
        }}>
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal isOpen={openEditModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.3)" },
          content: { background: "#242424" }
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll">
        <AddEditNotes getAllNotes={getAllNotes} type={openEditModal.type} noteData={openEditModal.data} onClose={() => {
          setOpenEditModal({ isShown: false, type: "add", data: null })
        }} showToast={handleShowToast} />
      </Modal>
      <Toast isShown={showToast.isShown} message={showToast.message} type={showToast.type} onClose={handleCloseToast} />
    </div>
  )
}

export default Home