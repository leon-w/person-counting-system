import { Box, Button, Skeleton, Switch } from '@mui/material';
import * as React from 'react';
import { FormControl, FormGroup, TextField, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';

class GeneralConfiguration extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            areaName: "",
            maximumPersons: 0,
            maskDetectionActivated: true,
            editionAreaName: "",
            editionMaximumPersons: 0,
            editionMaskDetectionActivated: true,
            isLoaded: false,
            strongError: null
        }

    }

    componentDidMount() {
        // Call the API for the number max of person (maybe more with the name)
        Promise.all([
            fetch('http://127.0.0.1:9000/api/get_customer_count'),
            fetch('http://127.0.0.1:9000/api/mask_detection')
        ]).then(results => Promise.all(results.map(r => r.json())) )
        .then( (responses)=>{
            console.log(responses);
            console.log(responses[0].maximal_customer_count)
            this.setState({
                areaName: "Museu Nacional d'Art de Catalunya",
                maximumPersons: responses[0].maximal_customer_count,
                maskDetectionActivated: responses[1].enabled,
                isLoaded: true
            });
            this.edit();
        }, (error) => {
            //console.log("Error from server : ", error)
                    this.setState({
                    //strongError: error
                });
        }
        );
    }

    render() {
        if (this.state.strongError) return <Navigate to={"/error"} />;
        return (
            <div>
                <FormControl fullWidth={true}>
                    <FormGroup sx={{ display: "flex", gap: 3, m: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography>
                                Place name :
                            </Typography>
                            <Skeleton sx={{display: this.state.isLoaded?"none":"block"}} variant="rectangular" width={200} height={10} />

                                <TextField label="Place name" variant="outlined" sx={{ m: 1, width: 500 }}
                                    value={this.state.editionAreaName}
                                    onChange={this.handleChange.bind(this)}
                                    name="nameArea"></TextField>

                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography>
                                Maximum occupation :
                            </Typography>
                            <Skeleton sx={{display: this.state.isLoaded?"none":"block"}} variant="rectangular" width={200} height={10} />
                                <TextField label="Capacity" variant="outlined" sx={{ m: 0, width: 500 }}
                                    value={this.state.editionMaximumPersons}
                                    onChange={this.handleChange.bind(this)}
                                    type="number"
                                    name="maxOccupation" ></TextField>

                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography>
                                Mask detection :
                            </Typography>
                            {/* <Skeleton sx={{display: this.state.isLoaded?"none":"block"}} variant="rectangular" width={200} height={10} /> */}
                            {/* <Box sx={{ display: this.state.isEdit ? "block" : "none" }}> */}
                                <Switch checked={this.state.editionMaskDetectionActivated} onChange={this.handleChange.bind(this)} name="mask"></Switch>
                            {/* </Box> */}
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Button onClick={() => this.validate()} variant="outlined">Save</Button>
                        </Box>

                    </FormGroup>
                </FormControl>
            </div>
        )
    }

    handleChange(event){
        switch (event.target.name){
            case "maxOccupation":
                this.setState({editionMaximumPersons: event.target.value});
                break;
            case 'nameArea':
                this.setState({editionAreaName: event.target.value});
                break;
            case 'mask':
                this.setState({editionMaskDetectionActivated: event.target.checked});
                break;
            default:
                break;
        }
    };

    edit() {
        this.setState({
            isEdit: true,
            editionAreaName: this.state.areaName,
            editionMaximumPersons: this.state.maximumPersons,
            editionMaskDetectionActivated: this.state.maskDetectionActivated
        });
    }

    cancel() {
        this.setState({ isEdit: false });
    }

    validate() {
        this.setState({
            isEdit: false,
            areaName: this.state.editionAreaName,
            maximumPersons: this.state.editionMaximumPersons,
            maskDetectionActivated: this.state.editionMaskDetectionActivated
         });
        //TODO send to the backend
        let urlMax = `http://127.0.0.1:9000/api/set_maximal_customer_count?maximal_customer_count=${this.state.editionMaximumPersons}`;
        fetch(urlMax, {method: "POST"}).then(res => res.json())
        .then(
          (result) => {
            //TODO : If not valid
            console.log(result);
          },
          (error) => {
              //console.log("Error from server : ", error)
          }
        );
        let urlMask = `http://127.0.0.1:9000//api/set_mask_detection?enabled=${this.state.editionMaskDetectionActivated}`;
        fetch(urlMask, {method: "POST"}).then(res => res.json())
        .then(
          (result) => {
            //TODO : If not valid
            console.log(result);
          },
          (error) => {
            //console.log("Error from server : ", error)
          }
        )
    }
}


export default GeneralConfiguration;