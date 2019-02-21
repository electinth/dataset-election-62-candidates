let CODE_TO_ZONES_PATH = "statics/postcode-to-zones.json";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { postcode: undefined };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let self = this;
    fetch(CODE_TO_ZONES_PATH)
      .then(resp => resp.json()) // Transform the data into json
      .then(function(data) {
        self.setState({ codeToZones: data });
      });
  }

  handleChange(event) {
    let v = event.target.value;
    if (v.length == 5) {
      let z = this.state.codeToZones[v];
      this.setState({ postcode: z });
      // todo: show button
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
            onChange={this.handleChange}
          />
        </div>
        {zones.length > 0 && (
          <div className="results">
            <div className="result-label">
              มีทั้งหมด {zones.length} เขตเลือกตั้ง
            </div>
            <ul className="zones">{zones}
              <li><b style={{color:'#0000cc'}}> &gt;&gt; คลิ๊กเพื่อ ดูรายชื่อผู้สมัคร &lt;&lt; </b></li>
            </ul>
          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById("root"));
