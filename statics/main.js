console.log('script loaded');

let CODE_TO_ZONES_PATH = 'statics/postcode-to-zones.json';

class Form extends React.Component {
    constructor(props) {
      super(props);
      this.state = {postcode: undefined};
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        let self = this;
        console.log('loading ' + CODE_TO_ZONES_PATH)
        fetch(CODE_TO_ZONES_PATH)
            .then((resp) => resp.json()) // Transform the data into json
            .then(function(data) {
                console.log('> data is loaded');
                self.setState({codeToZones: data});
            })
    }

    handleChange(event) {
        let v = event.target.value;
        console.log(v);
        if (v.length == 5) {
            let z = this.state.codeToZones[v];
            console.log(z)
            this.setState({postcode: z});
            // todo: show button
        } else {
            this.setState({postcode: undefined});
        }
    }

    render() {
        let buttons = [];

        if(this.state.postcode){
            buttons = this.state.postcode.zones.map( z => {
                let key = z.areas[0].province + '-' + z.zone ;
                console.log(key);
                let link = 'z/' + z.areas[0].province + '-' + z.zone + '.html';
                return <li key={key}>
                    <a href={link} key={key} target="_blank"> {z.areas[0].province} เขตเลือกตั้ง  {z.zone}</a>
                </li>
            });
        }

        console.log(buttons);
        
        return (
            <div >
                <b>รหัสไปรษณีย์</b> <input  type="text" pattern="\d*" maxLength="5" onChange={this.handleChange} />
                <ul>{buttons}</ul>
            </div>
        );
    }
  }

ReactDOM.render(
    <Form/>,
    document.getElementById('root')
)