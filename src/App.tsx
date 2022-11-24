import React from 'react';
import logo from './logo.svg';
import './App.css';
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewSegmentModal from './components/NewSegmentModal';
import { Button } from 'react-bootstrap';

function App() {
  const [modalShow, setModalShow] = React.useState(false);

  const onOpenModal = () => {
      setModalShow(true);
  }

  const onCloseModal = () => {
     setModalShow(false);
  }

  return (
    <div className="App">
          <Alert style={{width:'20%', marginLeft:'550px', marginTop:'250px'}} key={"primary"} variant={"primary"}>
            <Button onClick={onOpenModal}>Save Segment</Button>
          </Alert>

          {
            modalShow && 
            <NewSegmentModal
              openModal={modalShow}
              onClose={onCloseModal}
            />
          }
    </div>
  );
}

export default App;
