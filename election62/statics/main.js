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
        let zones = [];

        if(this.state.postcode){
            zones = this.state.postcode.zones.map( z => {
                let key = z.province + '-' + z.zone_id ;
                let link = 'z/' + key + '.html';
                return <li key={key} className="zone">
                    <a href={link} key={key} target="_blank">
                        <div className="header">
                            {z.province} เขตเลือกตั้งที่  {z.zone_id}
                        </div>
                        <ul>
                            {
                                z.areas.map( a => {
                                    return <li key={a.area}>
                                        <span className="area-name">
                                            {z.prefixes.area} {a.area}
                                        </span>
                                        { a.interior.length > 0 &&
                                            <span>(<b>เฉพาะ </b>{z.prefixes.sub_area} {a.interior.join(', ')})</span>
                                        }
                                        { a.exterior.length > 0 &&
                                            <span>(<b>ยกเว้น </b>{z.prefixes.sub_area} {a.exterior.join(', ')})</span>
                                        }
                                        { a.subinterior.length > 0 &&
                                            <span>(<b>เฉพาะ </b>{z.prefixes.sub_area} {a.subinterior.join(', ')})</span>
                                        }
                                    </li>
                                })
                            }
                        </ul>
                    </a>
                </li>
            });
        }

        console.log(zones);
        
        return (
            <div>
                <div className="form">
                    <div className="postcode-label">รหัสไปรษณีย์</div>
                    <input  type="text" pattern="\d*" maxLength="5" onChange={this.handleChange} />
                </div>
                { zones.length > 0 &&
                    <div className="results">
                        มีทั้งหมด <b>{zones.length}</b> เขตเลือกตั้ง
                        <ul className="zones">{zones}</ul>
                    </div>
                }
            </div>
        );
    }
  }

ReactDOM.render(
    <Form/>,
    document.getElementById('root')
)