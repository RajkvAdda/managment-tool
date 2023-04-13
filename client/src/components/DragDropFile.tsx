import { Box, Input, InputLabel, styled, Typography } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { CloseIconButton } from './IconButtons';

// icons
import Iconify from './iconify';

interface PropsI {
  checkError?: boolean;
  maxSize?: number;
  required?: boolean;
  error?: boolean;
  multiple?: boolean;
  base64?: boolean;
  format?: Array<any>;
  errorMsg?: string | null;
  value?: any;
  onChange: (files: Array<{ fileName: string; file: any; size: number; fileType: string }> | null) => void;
}

const LabelStyled = styled(InputLabel)(({ theme, error }) => ({
  '&': {
    border: `2px dashed ${error ? theme.palette.error.main : theme.palette.grey[400]}`,
    width: `100%`,
    display: 'flex',
    borderRadius: 5,
    color: theme.palette.grey[400],
    minHeight: 227,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    letterSpacing: 1.5,
    '&:hover': {
      border: `2px dashed ${error ? theme.palette.error.main : theme.palette.primary.main}`,
    },
  },
  '& .browse_text': {
    color: theme.palette.primary.main,
    letterSpacing: 1.5,
  },
  '&:hover .browse_text': { textDecoration: 'underline' },
}));

const DragDropFile: FC<PropsI> = ({
  checkError,
  required,
  error,
  maxSize,
  multiple,
  base64,
  format,
  value,
  errorMsg,
  onChange,
  ...rest
}) => {
  const [fileList, setFileList] = useState<Array<any>>([]);
  const [extention, setExtention] = useState('');
  const drop = useRef(null);

  const validateFileFormat = (fileType: string) => {
    console.log('fileType?.length', fileType?.length);
    if (format?.length <= 0 || fileType?.length < 1) return '';
    const isValid = format?.some((li) => fileType.toLowerCase()?.includes(li));
    return !isValid ? `Invalid Format - ${fileType} (eg: ${format?.join()})` : '';
  };

  const validateFileSize = (fileSize: number) => {
    const fileSizeAllowd = maxSize * 1024 * 1024;
    const isValid = fileSize > fileSizeAllowd;
    console.log('validateFileSize', fileSize, fileSizeAllowd, isValid ? `File size to be less than ${maxSize}mb` : '');
    return isValid ? `File size to be less than ${maxSize}mb` : '';
  };

  const getBase64File = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (errorFile) => reject(errorFile);
    });
  };

  const handleSingleFile = async (file: any) => {
    try {
      const modifiedFile = await getBase64File(file);
      //   const fileType = modifiedFile?.slice(0, modifiedFile?.indexOf(','));
      //   const base64Data = modifiedFile?.slice(modifiedFile?.indexOf(',') + 1);
      const extentionCurr = file?.name.slice(file?.name?.lastIndexOf('.') + 1);
      setExtention(extentionCurr);
      if (onChange) onChange(modifiedFile);
      else setFileList([modifiedFile]);
    } catch (err) {
      console.log('companyget-draganddtop', err);
      alert('invalid file');
    }
  };

  const handleError = () => {
    if (required && fileList.length <= 0) return true;
    if (!required && fileList.length <= 0) return false;
    if (validateFileFormat(extention ?? '')) return validateFileFormat(extention ?? '');
    if (validateFileSize(fileList[0]?.size ?? 0)) return validateFileSize(fileList[0]?.size ?? '');
    if (error) {
      return errorMsg;
    }
  };

  const removeFile = () => {
    setFileList([]);
    onChange(null);
    setExtention('');
    document.getElementById('drag_and_drop-field').value = null;
  };

  // drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;

    if (files && files.length) {
      handleSingleFile(files[0]);
    }
  };

  useEffect(() => {
    drop?.current?.addEventListener('dragover', handleDragOver);
    drop?.current?.addEventListener('drop', handleDrop);

    return () => {
      drop?.current?.removeEventListener('dragover', handleDragOver);
      drop?.current?.removeEventListener('drop', handleDrop);
    };
  }, []);

  useEffect(() => {
    if (value) {
      setFileList([value]);
    } else {
      setFileList([]);
    }
  }, [value]);
  console.log('draganddrop', extention);
  return (
    <div style={{ position: 'relative', margin: '2px 0 1rem 0', overflow: 'hidden' }}>
      <Input
        type="file"
        id="drag_and_drop-field"
        style={{ display: 'none' }}
        error={required ? Boolean(handleError()) : false}
        onChange={(e) => handleSingleFile(e.target.files[0])}
      />
      <LabelStyled
        id="drag_and_drop-field-label"
        {...rest}
        htmlFor="drag_and_drop-field"
        ref={drop}
        error={(checkError && required) || fileList.length > 0 ? Boolean(handleError()) : false}
      >
        {fileList[0] ? (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              opacity: 1,
              zIndex: 100,
              m: 1,
              backgroundColor: 'background.paper',
            }}
          >
            <img
              id="drag_drop_default_img"
              src={fileList[0]}
              width={`100%`}
              height="90%"
              style={{ objectFit: 'contain', objectPosition: 'top' }}
            />
            {fileList[0]?.fileName && (
              <Typography
                variant="caption"
                sx={{
                  pl: 1,
                  display: 'block',
                  color: 'primary.main',
                  width: `100%`,
                  textAlign: 'right',
                }}
              >
                {fileList[0]?.fileName}
              </Typography>
            )}
          </Box>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Iconify icon="mdi:cloud-upload-outline" />
            <Typography variant="subtitle2">Drag And Drop</Typography>
            <Typography variant="caption"> - or -</Typography>
            <Typography className="browse_text" variant="subtitle2">
              Browse
            </Typography>
          </div>
        )}
      </LabelStyled>

      {fileList[0] && handleError && (
        <div>
          <Typography
            sx={{
              cursor: 'pointer',
              pl: 1,
              color: 'error.main',
            }}
            variant="caption"
          >
            {handleError()}
          </Typography>
        </div>
      )}

      {extention?.length > 1 && fileList[0] && (
        <div>
          <CloseIconButton
            sx={{ cursor: 'pointer', color: 'error.main', position: 'absolute', zIndex: 104, top: 5, right: 5 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeFile();
            }}
          />
        </div>
      )}
    </div>
  );
};

DragDropFile.displayName = 'DragDropFile';
DragDropFile.defaultProps = {
  checkError: false,
  error: false,
  value: [],
  required: false,
  multiple: false,
  base64: false,
  format: [],
  maxSize: 50,
  errorMsg: null,
};

export default DragDropFile;
