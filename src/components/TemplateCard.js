import React from 'react';
import { useNavigate } from 'react-router-dom';

const TemplateCard = ({ title, description, icon, link, onClick }) => {
  const styles = {
    card: {
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: '#fafafa',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      width: '320px',
      height: '115px',
      textAlign: 'left',
    },
    icon: {
      marginBottom: '10px',
      fontSize: '32px',
      alignSelf: 'flex-start',
    },
    text: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    description: {
      fontSize: '17px',
      color: '#666',
    },
  };

  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.icon}>{icon}</div>
      <div style={styles.text}>
        <div style={styles.title}>{title}</div>
        <div style={styles.description}>{description}</div>
      </div>
    </div>
  );
};

export default TemplateCard;
