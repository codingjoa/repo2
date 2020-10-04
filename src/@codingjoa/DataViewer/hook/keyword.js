import React, {
  useRef,
  useState
} from 'react';

export default function useKeyword() {
  const TextFieldRef = useRef(null);
  const [ searchKeyword, setSearchKeyword ] = useState('');
  return { TextFieldRef, searchKeyword, setSearchKeyword };
}
