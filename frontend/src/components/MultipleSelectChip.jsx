import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const options = [
    "Logo",
    "Footer",
    "Social proof",
    "Powerful calls to action",
    "Contact information",
    "Navigation",
    "Content",
    "Benefits",
    "header",
    "about",
];
const colors = [
    { color: "grey", value: "#A9A9A9" },
    { color: "red", value: "#DC143C" },
    { color: "yellow", value: "#FFFF00" },
    { color: "green", value: "#9ACD32" },
    { color: "beige", value: "#F5F5DC" },
    { color: "orange", value: "#FFA500" },
    { color: "brown", value: "#8B4513" },
    { color: "white", value: "#FFFFFF" },
    { color: "turquoise", value: "#40E0D0" },
    { color: "light blue", value: "#ADD8E6" },
    { color: "blue", value: "#4169E1" },
    { color: "pink", value: "#FF69B4" },
    { color: "purple", value: "#8B008B" }
]
function getStyles(option, selectedOptions, theme) {
    return {
        fontWeight: selectedOptions.includes(option)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

export default function MultipleSelectChip(props) {
    const { type } = props
    const theme = useTheme();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const label = type == "options" ? "Components" : "Colors";
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedOptions(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
                <Select
                       labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    multiple
                    value={selectedOptions}
                    label={label}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {type == "options" ? options.map((option) => (
                        <MenuItem
                            key={option}
                            value={option}
                            style={getStyles(option, selectedOptions, theme)}

                        >
                            {option}
                        </MenuItem>
                    )) : colors.map((option) => (
                        <MenuItem
                            key={option.color}
                            value={option.color}
                            style={{ ...getStyles(option.color, selectedOptions, theme), backgroundColor: option.value, opacity: 0.9 }}

                        >
                            {option.color}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}