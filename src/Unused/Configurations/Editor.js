import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

function Objective(key, value) {
  return {[key]: value};
}
function EditPrompt(label, text, field, callback) {
  const r = window.prompt(label, text);
  if(r === null) return;
  callback(Objective(field, r));
}

function DeleteQuestion(question, callback) {
  const r = window.confirm(`${question} 삭제하시겠습니까?`);
  if(!r) return;
  callback();
}

export default ({
  callEdit,
  callDelete,
  label,
  text,
  field,
  suffix,
  question
}) => {
  return (
    <Box display="flex">
      <Box flexGrow={1} alignSelf="center">
        {label &&
          <Typography variant="subtitle2">
            {label}
          </Typography>
        }
        <Typography variant="h5">
          {text}{suffix}
        </Typography>
      </Box>
      {callEdit &&
        <Box>
          <Button onClick={e => EditPrompt(label, text, field, callEdit)}>
            수정
          </Button>
        </Box>
      }
      {callDelete &&
        <Box>
          <Button onClick={e => DeleteQuestion(question, callDelete)}>
            삭제
          </Button>
        </Box>
      }
    </Box>
  );
}
