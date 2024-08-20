import React from 'react';

const styles = {
    sidebar: {
        width: '0',
        transition: 'width 0.3s',
        position: 'fixed',
        top: '0',
        left: '300px', // Align it immediately next to the Sidebar
        height: '100%',
        backgroundColor: '#fff',
        boxShadow: '-4px 0 10px rgba(0,0,0,0.2)', // Enhanced shadow for card effect
        borderRadius: '8px', // Rounded corners for card effect
        overflowY: 'auto', // Ensure scrolling if content overflows
        zIndex: 1000, // Ensure it appears on top
        borderRight: '3px solid #ddd', // Added right border for emphasis
    },
    sidebarOpen: {
        width: '280px', // Adjust width as needed
    },
    searchBarContainer: {
        padding: '15px 20px',
        borderBottom: '2px solid #ddd', // Slightly thicker border for emphasis
    },
    searchBar: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px', // Match border radius for consistency
        border: '1px solid #ddd',
    },
    list: {
        listStyle: 'none',
        padding: '0',
        margin: '0', // Remove default margin
    },
    card: {
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Card shadow effect
        borderRadius: '8px', // Rounded corners for card effect
        margin: '15px', // Spacing between cards
        padding: '15px', // Padding inside the card
        transition: 'background-color 0.3s', // Smooth transition for hover effect
        cursor: 'pointer',
    },
    cardHover: {
        backgroundColor: '#f4f4f4', // Lighter background on hover
    },
    cardContent: {
        fontSize: '16px',
        color: '#333', // Darker text color for better contrast
    },
};

const SearchSidebar = ({ isOpen }) => {
    return (
        <div
            style={{
                ...styles.sidebar,
                ...(isOpen ? styles.sidebarOpen : {}),
            }}
        >
            <div style={styles.searchBarContainer}>
                <input
                    type="text"
                    placeholder="Search..."
                    style={styles.searchBar}
                />
            </div>
            <ul style={styles.list}>
                <li
                    style={styles.card}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.cardHover.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.card.backgroundColor}
                >
                    <div style={styles.cardContent}>Search Result 1</div>
                </li>
                <li
                    style={styles.card}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.cardHover.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.card.backgroundColor}
                >
                    <div style={styles.cardContent}>Search Result 2</div>
                </li>
                <li
                    style={styles.card}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.cardHover.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.card.backgroundColor}
                >
                    <div style={styles.cardContent}>Search Result 3</div>
                </li>
                {/* Add more search results as needed */}
            </ul>
        </div>
    );
};

export default SearchSidebar;
