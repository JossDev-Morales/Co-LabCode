export default class customError extends Error {
  name: string;
  code: number;
  info: Record<string, any>;
  status:number
  constructor(name: string,status:number, code: number, props: Record<string, any>) {
    super(props.message);
    this.name = name;
    this.status=status
    this.code = code;
    this.info = {};
    if (props) {
      let propertys = Object.keys(props);
      propertys.forEach((key: string) => {
        this.info[key] = props[key];
      });
    }
  }
}

