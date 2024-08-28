import React from 'react';

const styles = {
    sidebar: {
        width: '0',
        transition: 'width 0.3s',
        position: 'fixed',
        top: '0',
        left: '300px', // Adjust if needed to align next to the existing sidebar
        height: '100%',
        backgroundColor: '#fff',
        boxShadow: '-4px 0 10px rgba(0,0,0,0.2)', // Shadow effect
        borderRadius: '8px', // Rounded corners for card effect
        overflowY: 'auto', // Ensure scrolling if content overflows
        zIndex: 1000, // Ensure it appears on top
        borderRight: '3px solid #ddd', // Right border for emphasis
    },
    sidebarOpen: {
        width: 'calc(100% - 300px)', // Adjust width to cover remaining space
        left: '300px', // Align it immediately next to the existing sidebar
    },
    searchBarContainer: {
        padding: '15px 20px',
        borderBottom: '2px solid #ddd',
    },
    searchBar: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
    },
    list: {
        listStyle: 'none',
        padding: '0',
        margin: '0',
    },
    card: {
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        margin: '15px',
        padding: '15px',
        transition: 'background-color 0.3s',
        cursor: 'pointer',
    },
    cardHover: {
        backgroundColor: '#f4f4f4',
    },
    cardContent: {
        fontSize: '16px',
        color: '#333',
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
