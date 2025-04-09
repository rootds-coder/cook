class ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: any;

  constructor(statusCode: number, message: string, data: any = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.data = data;
  }
}

export default ApiResponse; 