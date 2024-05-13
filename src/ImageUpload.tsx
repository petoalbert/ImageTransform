import React from 'react';

const ImageUpload: React.FC<{ setBitmap: (_: ImageBitmap) => void }> = ({ setBitmap }: { setBitmap: (_: ImageBitmap) => void }) => {
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        createImageBitmap(file).then(setBitmap)
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        createImageBitmap(file).then(setBitmap);
    };

    return (
        <div
            id="upload"
            style={{ width: '300px', height: '300px', border: '2px dashed gray' }}
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
        >
            <p>Drag and drop an image here, or click to select an image.</p>
            <input type="file" accept="image/*" onChange={handleFileInputChange} />
        </div>
    );
};

export default ImageUpload;