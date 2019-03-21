let CODE_TO_ZONES_PATH = "statics/postcode-to-zones.json";
let TAMBON2ZONE_PATH = "statics/all-tambon-2-election-zones.json";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { postcode: undefined, tambon2Zone: undefined, isLoadingTambon2Zone: false };
    this.handlePostcodeChange = this.handlePostcodeChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
  }

  componentDidMount() {
    let self = this;
    let pCodeToZones = fetch(CODE_TO_ZONES_PATH)
      .then(resp => resp.json()) 
      .then(data => {
        self.setState({ codeToZones: data});
      });
  }

  handleAddressChange(event) {
    let v = event.target.value;
    if(!this.state.tambon2Zone && !this.state.isLoadingTambon2Zone){
      this.setState({isLoadingTambon2Zone: true})
      console.log('load tamboon 2 zone')
      let pTambon2Zone = fetch(TAMBON2ZONE_PATH)
        .then(resp => resp.json())
        .then(data => {
          data = data.map(a => {
            a['slug'] = a['tambon'] + '-' + a['amphur'] + '-' + a['province']
            return a
          });
          this.setState({ tambon2Zone: data, isLoadingTambon2Zone: false});
        });
    } else if(this.state.tambon2Zone && !this.state.isLoadingTambon2Zone && v.length > 3) {
      
      let areas = this.state.tambon2Zone.filter(a => a['slug'].indexOf(v) > -1)
        .map(a => {
          a['idf'] = a['slug'].indexOf(v)
          if(a['province'] == 'กรุงเทพมหานคร') {
            a['prefix']  = {
              area: 'เขต',
              subarea: 'แขวง'
            }
          } else {
            a['prefix']  = {
              area: 'ตำบล',
              subarea: 'อำเภอ'
            }
          }
          return a
        })
        .slice(0, 5)

      areas.sort( (a, b) => a['idf'] - b['idf'])
      this.setState({addressQueryAreas: areas, postcode: undefined});
    } else {
      console.log('is loading');
    }

    if(v.length ==0){
      this.setState({addressQueryAreas: undefined});
    }
  }

  handlePostcodeChange(event) {
    let v = event.target.value;

    if (v.length == 5) {
      let z = this.state.codeToZones[v];
      this.setState({ postcode: z, addressQueryAreas: undefined});
    } else {
      this.setState({ postcode: undefined });
    }

  }

  render() {
    let zones = [];

    if (this.state.postcode) {
      zones = this.state.postcode.zones.map(z => {
        let key = z.province + "-" + z.zone;
        let link = "z/" + key + ".html";
        return (
          <li key={key} className="zone">
            <a href={link} key={key} target="_blank">
              <div className="header">
                {z.province} เขตเลือกตั้งที่ {z.zone}
              </div>
              <ul>
                {z.areas.map(a => {
                  return (
                    <li className="sub-area" key={a.area}>
                      <span className="area-name">
                        {z.prefixes.area} {a.area}
                      </span>
                      {a.interior.length > 0 && (
                        <span>
                          <b>เฉพาะ </b>
                          {z.prefixes.sub_area} {a.interior.join(", ")}
                        </span>
                      )}
                      {a.exterior.length > 0 && (
                        <span>
                          <b>ยกเว้น </b>
                          {z.prefixes.sub_area} {a.exterior.join(", ")}
                        </span>
                      )}
                      {a.subinterior.length > 0 && (
                        <span>
                          <b>เฉพาะ </b>
                          {a.subinterior.join(", ")}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </a>
          </li>
        );
      });
    } else if(this.state.addressQueryAreas){
      zones = this.state.addressQueryAreas.map(z => {
        let key = z.province + "-" + z.zone;
        let link = "z/" + key + ".html";
        return (
          <li key={z.slug} className="zone">
            <a href={link} target="_blank">
              <div className="header">
                {z.province} เขตเลือกตั้งที่ {z.zone}
              </div>
              <span className="area-name">
                {z.prefix.area} {z.tambon} {z.prefix.subarea} {z.amphur}
              </span>
            </a>
          </li>
        );
      });
    }

    return (
      <div>
        <div className="form">
          <div className="postcode-label">
            ค้นหาจาก<b>รหัสไปรษณีย์</b>
          </div>
          <input
            type="text"
            pattern="\d*"
            maxLength="5"
            onChange={this.handlePostcodeChange}
          />
        </div>
        { !this.state.postcode && 
          <div>
            <div className="form-separator">
              <span>หรือ</span>
            </div>
            <div className="form">
              <div className="postcode-label">
                ค้นหาจาก<b>ที่อยู่</b>
              </div>
              <input
                type="text"
                onChange={this.handleAddressChange}
              />
            </div>
          </div>
        }
        {zones.length > 0 && (
          <div className="results">
            <div className="result-label">
            { this.state.postcode && 
              <span>
                มีทั้งหมด {zones.length} เขตเลือกตั้ง
              </span>
            }
            { this.state.addressQueryAreas && 
              <span>
               {zones.length} ที่อยู่ที่ใกล้เคียงคำค้นหา
              </span>
            }
            </div>
            <ul className="zones">
              {zones}
            </ul>
            <div className="ui-guide">
              <i className="fas fa-hand-point-up"></i>
              คลิก เพื่อดูรายชื่อผู้สมัคร 
            </div>
          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById("root"));
