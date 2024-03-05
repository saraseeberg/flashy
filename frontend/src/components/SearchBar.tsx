import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </Grid>
            <Grid item>
                <Button variant="contained" onClick={handleSearch}>
                    Search
                </Button>
            </Grid>
        </Grid>
    );
};

export default SearchBar;