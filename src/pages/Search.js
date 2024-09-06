import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Chip,
    IconButton,
    InputBase,
    List, ListItem,
    Paper
} from '@mui/material';
import React, { useState } from 'react';
import LeftPanel from '../components/LeftPanel';
import blurBg from "../assets/blur.jpeg";

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(true);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setShowResults(true);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setShowResults(false);
    };

    const searchResults = [
        { label: 'Ticket #65432', color: 'primary' },
        { label: 'Password Reset', color: 'warning' },
        { label: 'Ticket #65432', color: 'secondary' },
    ];

    const getChipColor = (color) => {
        switch (color) {
            case 'primary':
                return '#34abeb'; 
            case 'secondary':
                return '#4f34eb'; 
            case 'warning':
                 
                return '#ebdf34';
            default:
                return '#grey'; 
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Left Panel */}
            <LeftPanel />

            {/* Main Content Wrapper */}
            <div style={{ flex: 1, position: 'relative' }}>
                {/* Blurred Background */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${blurBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        filter: 'blur(8px)',
                        zIndex: 1,
                    }}
                />
                
                {/* Main Content */}
                <main
                    className="content foreground"
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        padding: '16px',
                        margin: '0 16px',
                    }}
                >
                    <Paper
                        sx={{
                            width: '1100px',
                            minHeight: '550px',
                            border:'1px solid #484848',
                            padding: '16px',
                            borderRadius: '16px',
                            backgroundColor: '#1C1C1E',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#2C2C2E',
                                borderRadius: '30px',
                                padding: '0.5rem',
                            }}
                        >
                            <IconButton type="button" sx={{ p: '6px', color: '#ffffff' }}>
                                <SearchIcon />
                            </IconButton>
                            <InputBase
                                placeholder="Search"
                                value={searchQuery}
                                onChange={handleSearch}
                                sx={{
                                    ml: 1,
                                    flex: 1,
                                    color: '#ffffff',
                                    width: '200px',
                                    padding: '5px',
                                    fontSize: '14px',
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        
                            <IconButton
                                onClick={handleClearSearch}
                                sx={{ p: '6px', color: '#ffffff' }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {showResults && (
                            <List
                                sx={{
                                    mt: 2,
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {searchResults.map((result, index) => (
                                    <ListItem key={index} sx={{ width: 'auto', padding: 0, mr: 1 }}>
                                        <Chip
                                            label={result.label}
                                            sx={{ 
                                                color: getChipColor(result.color),
                                                backgroundColor:'#303030',
                                                transition: 'background-color 0.3s ease', 
                                                '&:hover': {
                                                    backgroundColor: '#696969', 
                                                    cursor: 'pointer', 
                                                    transform: 'scale(1.05)'
                                                }
                                                
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </main>
            </div>
        </div>
    );
};

export default SearchPage;



// import CloseIcon from '@mui/icons-material/Close';
// import SearchIcon from '@mui/icons-material/Search';
// import {
//     Box,
//     Chip,
//     IconButton,
//     InputBase,
//     List, ListItem,
//     Paper
// } from '@mui/material';
// import React, { useState } from 'react';
// import LeftPanel from '../components/LeftPanel';
// import blurBg from "../assets/blur.jpeg";

// const SearchPage = () => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [showResults, setShowResults] = useState(true);


//     const handleSearch = (event) => {
//         setSearchQuery(event.target.value);
//         setShowResults(true); // Show results when the user types
//     };

//     const handleClearSearch = () => {
//         setSearchQuery('');
//         setShowResults(false); // Hide results when search is cleared
//     };

//     const searchResults = [
//         { label: 'Ticket #65432', color: 'primary' },
//         { label: 'Password Reset', color: 'warning' },
//         { label: 'Ticket #65432', color: 'secondary' },
//     ];

//     return (
//         <>
//             <div className="dashboard background">
//                 <LeftPanel />
//                 <main className="content foreground">
//                     <Paper
//                         sx={{
//                             width: '600px',
//                             minHeight: '400px',
//                             padding: '16px',
//                             borderRadius: '16px',
//                             backgroundColor: '#1C1C1E',
//                             boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
//                         }}
//                     >
//                         <Box
//                             sx={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 backgroundColor: '#2C2C2E',
//                                 borderRadius: '50px',
//                                 padding: '2rem',
//                             }}
//                         >
//                             <InputBase
//                                 placeholder="Search"
//                                 value={searchQuery}
//                                 onChange={handleSearch}
//                                 sx={{ ml: 1, flex: 1, color: '#ffffff',width: '200px',height: '5px' }}
//                                 inputProps={{ 'aria-label': 'search' }}
                                
//                             />
//                             <IconButton type="button" sx={{ p: '10px', color: '#ffffff' }}>
//                                 <SearchIcon />
//                             </IconButton>
//                             <IconButton
//                                 onClick={handleClearSearch}
//                                 sx={{ p: '10px', color: '#ffffff' }}
//                             >
//                                 <CloseIcon />
//                             </IconButton>
//                         </Box>

//                         {/* Render results if search is active */}
//                         {showResults && (
//                             <List
//                                 sx={{
//                                     mt: 2,
//                                     display: 'flex',
//                                     justifyContent: 'flex-start',
//                                     flexWrap: 'wrap',
//                                 }}
//                             >
//                                 {searchResults.map((result, index) => (
//                                     <ListItem key={index} sx={{ width: 'auto', padding: 0, mr: 1 }}>
//                                         <Chip
//                                             label={result.label}
//                                             sx={{ backgroundColor: 'gray', color: result.color }}
//                                         />
//                                     </ListItem>
//                                 ))}
//                             </List>
//                         )}
//                     </Paper>
//                 </main>
//             </div >
//         </>
//     );
// };

// export default SearchPage;
