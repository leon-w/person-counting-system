import * as React from 'react'
import OccupationContext from './OccupationContext';
import OccupationService from './OccupationService';

class OccupationServiceProvider extends React.Component{

    constructor(){
        super();
        this.state = {
            occupationService : new OccupationService()
        }
    }
    componentDidMount(){
        //this.setState({occupationService : new OccupationService()});
    }

    render(){
        return <OccupationContext.Provider value={this.state.occupationService}>
            {this.props.children}
        </OccupationContext.Provider>
    }
}

export default OccupationServiceProvider;