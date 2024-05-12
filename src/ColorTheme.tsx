import React, { useState } from 'react';
import { Pixel } from './ImageMatrix';

interface ColorTheme {
    colors: Pixel[];
}

interface ColorThemeProps {
    updateTheme: (theme: ColorTheme) => void;
    theme: ColorTheme
}

const ColorTheme: React.FC<ColorThemeProps> = ({ updateTheme, theme }) => {
    const updateColor = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        updateTheme({ colors: theme.colors.map((color, i) => i === index ? getPixel(event.target.value) : color) });
    };

    const removeColor = (index: number) => {
        if (theme.colors.length > 2) {
            const newColors = theme.colors.filter((_, i) => i !== index)
            updateTheme({ colors: newColors });
        }
    }

    const addColor = () => {
        if (theme.colors.length < 10) {
            const newColors = theme.colors.concat({ r: 0, g: 0, b: 0, a: 255 })
            updateTheme({ colors: newColors });
        }
    }

    return (<form>
        <div className='row'>
            <div className='col'></div>
            {theme.colors.map((color, index) => (
                <div className='col-sm-1 d-flex align-items-center' key={index}>
                    <div style={{ display: 'inline-block' }}>
                        <input type="color"
                            onInput={(event: React.ChangeEvent<HTMLInputElement>) => updateColor(event, index)}
                            className="form-control form-control-color"
                            value={pixelToHex(color)}
                            id={"color" + index}
                            title="Choose your color"></input>
                    </div>
                    <svg onClick={_ => removeColor(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-square-fill" viewBox="0 0 16 16">
                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
                    </svg>
                </div>
            ))}
            {theme.colors.length < 8 && <div className="col-sm-1 d-flex align-items-center">
                <svg onClick={_ => addColor()} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
            </div>}
            <div className='col'></div>
        </div>
    </form>)
};

function getPixel(colorHex: string): Pixel {
    const r = parseInt(colorHex.substring(1, 3), 16);
    const g = parseInt(colorHex.substring(3, 5), 16);
    const b = parseInt(colorHex.substring(5, 7), 16);
    return { r, g, b, a: 255 };
}

function pixelToHex(pixel: Pixel): string {
    return '#' +
        pixel.r.toString(16).padStart(2, '0') +
        pixel.g.toString(16).padStart(2, '0') +
        pixel.b.toString(16).padStart(2, '0')
}

function multiply(color: Pixel): Pixel[] {
    let pixels = [color]

    let r = color.r
    let g = color.g
    let b = color.b

    while (r < 255 || g < 255 || b < 255) {
        r = Math.min(r + 50, 255)
        g = Math.min(g + 50, 255)
        b = Math.min(b + 50, 255)
        pixels.push({ r, g, b, a: 255 })
    }

    return pixels
}

export default ColorTheme;