//Filename: src/components/ConfirmModal.jsx

import React from "react";
import "./ConfirmModal.css";

const ConfirmModal = ({ open, title, message, confirmLabel, onConfirm, onClose }) => {
	if ( ! open)
	{
		return null;
	}
	
	return (
	  <div className="confirm-backdrop">
	    <div className="confirm-modal">
		
		  <h2 className="confirm-title">{title}</h2>
		  <p className="confirm-message">{message}</p>
		  
		  <div className="confirm-actions">
		    <button className="confirm-btn cancel" onClick={onClose}>
			  Cancel
			</button>
			
			<button className="confirm-btn confirm" onClick={onConfirm}>
			  {confirmLabel}
			</button>
		  </div>
		</div>
	  </div>
	);
};

export default ConfirmModal;