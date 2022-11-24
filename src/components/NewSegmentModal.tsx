import { Button, Card, Form, Modal } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from "react";


const DEFAULT_SCHEMA_OPTIONS: any = [
    {value: "add_schema_to_segment", name:"Add schema to segment"},
    {value : "first_name", name:"First Name"},
    {value : "last_name", name:"Last Name"},
    {value : "gender", name:"Gender"},
    {value : "age", name:"Age"},
    {value : "account_name", name:"Account Name"},
    {value : "city", name:"City"},
    {value : "state", name:"State"},
];


export default function NewSegmentModal(props: any) {
    const [segmentName, setSegmentName] = useState<any>("");
    const [selectedSchemaType, setSelectedSchemaType] = useState<any>(undefined);
    const [selectedSchemaTypes, setSelectedSchemaTypes] = useState<any>([]);
    const [selectedDropDowns, setSelectedDropDowns] = useState<any>([]);
    const [schemaOptions, setSchemaOptions] = useState<any>([]);

    useEffect(() => {
        const options: any = getDropDownOption(DEFAULT_SCHEMA_OPTIONS);
        setSchemaOptions(options);
    }, [])

    useEffect(() => {
        resetSchemaDropDown();
    }, [selectedSchemaTypes]);

    const getDropDownOption: any = (allOptions: any) => {
        let options : any = [];
        if (allOptions !== undefined && allOptions.length !== 0) {
            allOptions.forEach((option: any) => {
                let option_: any = ""
                if (option.value === "add_schema_to_segment") {
                    option_ = <option defaultValue={option.value} unselectable={option.value}>{option.name}</option>
                } else {
                    option_= <option value={option.value} >{option.name}</option>
                }
                options.push(option_);
            })
            //setSchemaOptions(options);
        }
        return options;
    }
    
    const handleClose = () => {
        props.onClose();
    }

    const getSelectedDropDown: any = (selectedOption: any) => {
        return <Row>
                    <Col md={12}>
                        <Form.Select id={selectedOption} aria-label="Default select example" style={{marginTop:'10px'}}
                            value={selectedOption}
                            >
                           {getDropDownOption(DEFAULT_SCHEMA_OPTIONS)}
                        </Form.Select>
                    </Col>
                </Row>
    }

    const addNewSchema = () => {
        if (selectedSchemaType !== undefined && selectedSchemaType !== 'Add schema to segment') {
            setSelectedSchemaTypes([...selectedSchemaTypes, selectedSchemaType]);

            const dropDown = getSelectedDropDown(selectedSchemaType);
            let existingValues = [...selectedDropDowns];
            existingValues.push(dropDown);
            setSelectedDropDowns(existingValues);
        }
    }

    const resetSchemaDropDown = () => {
        let filteredSchemaTypes: any = [];
        if (selectedSchemaTypes === undefined || selectedSchemaTypes.length === 0) {
            filteredSchemaTypes = DEFAULT_SCHEMA_OPTIONS;
        } else {
            const allOptions:any = DEFAULT_SCHEMA_OPTIONS;
            allOptions.forEach((option: any) => {
                if (selectedSchemaTypes.includes(option.value) === false) {
                    filteredSchemaTypes.push(option);
                }
            });
        }
        const filteredOptions = getDropDownOption(filteredSchemaTypes);
        setSchemaOptions(filteredOptions);
        setSelectedSchemaType(DEFAULT_SCHEMA_OPTIONS[0].value);
    }

    const onSchemaTypeDropDownChange = (e: any) => {
        setSelectedSchemaType(e.target.value);
    }

    const onSegmentNameChange = (e: any) => {
        setSegmentName(e.target.value);
    }

    const onSave = () => {
        if (segmentName === undefined || segmentName.trim().length === 0) {
            alert("Segment name should not be empty");
            return;
        }

        if (selectedSchemaTypes === undefined || selectedSchemaTypes.length === 0) {
            alert("Please select the schema.");
            return;
        }

        let segmentObj = {
            ["segment_name"] :segmentName,
            ["schema"]:getSelectedSchemaObject()
        }
        console.log("FINAL SCHEMA : " + JSON.stringify(segmentObj));

        fetch('https://webhook.site/798d51fc-a011-4ed4-9dac-f2f26a0e0b93', {
            method: 'POST',
            body: JSON.stringify(segmentObj),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
          })
             .then((response) => {
                if(response.status === 200){
                    alert("Successfully saved the segment");
                    clearData();
                 } else{
                    throw "error"
                 }
             })
             .then((data) => {
                console.log(data);
                // Handle data
             })
             .catch((err) => {
                console.log(err.message);
            });
    }

    const clearData = () => {
        setSegmentName("");
        setSelectedSchemaType(undefined);
        setSelectedSchemaTypes([]);
        setSelectedDropDowns([]);
        setSchemaOptions(DEFAULT_SCHEMA_OPTIONS);
        handleClose();
    }

    const getSelectedSchemaObject: any = () => {
        let schemaObj: any = [];
        const allOptions:any = DEFAULT_SCHEMA_OPTIONS;
        allOptions.forEach((option: any) => {
            if (selectedSchemaTypes.includes(option.value) === true) {
                const obj: any = {
                    [option.value] : option.name
                }
                schemaObj.push(obj);
            }
        });
        return schemaObj;
    }

    return (
        <>
            <Modal
                show={props.openModal} 
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Saving Segment
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Enter the Name of the Segment</Form.Label>
                            <Form.Control type="text" value={segmentName} onChange={onSegmentNameChange} placeholder="Name of the Segment" />
                            <Form.Text className="text-muted" >
                            </Form.Text>
                        </Form.Group>

                        <Form.Label htmlFor="label">To save your segment, you need to add the schemas to build the query</Form.Label>
                        {   
                            selectedSchemaTypes !== undefined && selectedSchemaTypes.length !== 0 &&
                            <Card >
                                {/* <Card.Body>This is some text within a card body.</Card.Body> */}
                                <div 
                                    style={{paddingBottom:'10px', paddingLeft:'10px', paddingRight:'10px'}}
                                    >
                                    {selectedDropDowns}
                                    
                                </div>
                            </Card>
                        }
                        
                        <Form.Select aria-label="Default select example" style={{marginTop:'10px'}}
                                value={selectedSchemaType}
                                onChange={onSchemaTypeDropDownChange}
                            >
                            {schemaOptions}
                        </Form.Select>
                        <div style={{marginTop:'10px'}}>
                            <Card.Link href="#" onClick={addNewSchema}>+ Add new schema</Card.Link>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onSave}>
                        {UIConstants.saveTheSegment}
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}