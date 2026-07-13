class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {any} data - Payload data
   * @param {string} message - Success description message
   */
  constructor(statusCode, data = null, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    
    // We only attach data if it's not null/undefined
    if (data !== null) {
      this.data = data;
    }
  }

  /**
   * Helper to send response via Express response object
   * @param {object} res - Express response object
   */
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      ...(this.data !== undefined && { data: this.data }),
    });
  }
}

export default ApiResponse;
