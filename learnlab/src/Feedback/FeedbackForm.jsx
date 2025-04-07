import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    rating: 1,
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback({
      ...feedback,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:8080/public/addFeedback', feedback);
      
      if (response.status === 200) {
        toast.success('Feedback submitted successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Reset form after successful submission
        setFeedback({ 
          name: '', 
          email: '', 
          rating: 1, 
          comments: '' 
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-center mb-6">Feedback Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={feedback.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block font-semibold">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={feedback.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="rating" className="block font-semibold">Rating</label>
          <select
            id="rating"
            name="rating"
            value={feedback.rating}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="1">😞 - Poor</option>
            <option value="2">😐 - Fair</option>
            <option value="3">🙂 - Good</option>
            <option value="4">😊 - Very Good</option>
            <option value="5">😍 - Excellent</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="comments" className="block font-semibold">Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={feedback.comments}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Write your comments here..."
            rows="4"
          ></textarea>
        </div>

        <button 
          type="submit" 
          className={`w-full p-3 rounded-lg ${isSubmitting ? 'bg-purple-400' : 'bg-purple-600'} text-white`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
  
}