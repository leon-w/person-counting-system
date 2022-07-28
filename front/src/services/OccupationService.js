class OccupationService{

    constructor(){
        this.customerChange = {callbacks: new Map(), counter: 0};
        this.webSocketOpen = {callbacks: new Map(), counter: 0};
        this.missingMask = {callbacks: new Map(), counter: 0};
        this.initializeWebSocket();
    }

    initializeWebSocket(){
        fetch('http://127.0.0.1:9000/api/get_customer_count').then((res)=>res.json())
        .then(
            (result) => {
                this.updateValue(result.current_customer_count, result.maximal_customer_count)
            },
            (error) => {
              console.log("Error from server : ", error)
            }
        );
        this.socket = new WebSocket('ws://127.0.0.1:9001');

        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onopen = this.onOpen.bind(this);
        // Simulate the load of websocket
        // setTimeout(()=>{
        //     this.updateValue(25,50)
        //     // Fake websocket sending data each second
        //     this.interval = setInterval(()=>{
        //         // New data from the websocket
        //         let rd = Math.random()>0.5 ? 1: -1;
        //         // Update the different value 
        //         this.updateValue(this.occupation+rd, this.maxOccupation);
        //     }, 1000)
        // },100);
    }
    
    /**
     * Call the different function depending on the message of the web socket
     * @param {*} event 
     */
    onMessage(event) {
        let data = JSON.parse(event.data);
        console.log(event.data, this.customerChange)
        switch (data.message_type){
            case "customer_count_change":
                this.updateValue(data.content.current_customer_count, data.content.maximal_customer_count);
                break;
            case "missing_mask_detected":
                this.maskDetection();
                break;
            default:
                break;
        }
    }
    /**
     * Call a callback when the websocket is open
     * @param {*} event 
     */
    onOpen(event){
        this.webSocketOpen.callbacks.forEach((callback,counter)=> callback())
    }

    /**
     * Destroy the service and the websocket
     */
    destroy(){
        this.socket.close();
    }

    /**
     * Update the value of the counters and call the callback
     * @param {*} currentCustomerCount 
     * @param {*} maximalCustomerCount 
     */
    updateValue(currentCustomerCount, maximalCustomerCount){
        this.currentCustomerCount = currentCustomerCount;
        this.maximalCustomerCount = maximalCustomerCount;

        this.customerChange.callbacks.forEach((callback,counter)=> callback(currentCustomerCount, maximalCustomerCount));
    }
    /**
     * Call the callback for mask detection
     */
    maskDetection(){
        this.missingMask.callbacks.forEach((callback,counter)=> callback());
    }
    /**
     * Override to the server the customerCount
     * @param {*} customerCount 
     */
    overrideCounter(customerCount){
        fetch(`http://127.0.0.1:9000/api/set_customer_count_override?customer_count=${customerCount}`, {method: "POST"})
        .then(res => res.json()).then(
            (result) => {
                //TODO : If not valid
                console.log(result);
              },
              (error) => {
                  //console.log("Error from server : ", error)
                // this.setState({
                //   strongError: error
                // });
              }
        )
    }

    addCallbackMask(callback){
        const counter = this.missingMask.counter + 1;
        this.missingMask.callbacks.set(counter, callback);
        this.missingMask.counter = counter;
        return counter
    }

    removeCallbackMask(counter){
        this.missingMask.callbacks.delete(counter)
    }

    addCallbackWebSocketOpen(callback){
        const counter = this.webSocketOpen.counter + 1;
        this.webSocketOpen.callbacks.set(counter, callback);
        this.webSocketOpen.counter = counter;
        return counter
    }

    removeCallbackWebSocketOpen(counter){
        this.webSocketOpen.callbacks.delete(counter)
    }

    addCallbackCustomerChange(callback){
        console.log("add")
        const counter = this.customerChange.counter + 1;
        this.customerChange.callbacks.set(counter, callback);
        this.customerChange.counter = counter;
        this.updateValue(this.currentCustomerCount, this.maximalCustomerCount)
        return counter
    }

    removeCallbackCustomerChange(counter){
        console.log("remove")
        this.customerChange.callbacks.delete(counter)
    }    
}

export default OccupationService;