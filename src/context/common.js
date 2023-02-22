export class response {
  constructor(dispatch, RESPONSE_STATUS) {
    this.dispatch = dispatch;
    this.RESPONSE_STATUS = RESPONSE_STATUS;
  }

  async commonErrorResponse(from, noAlert) {
    if (!noAlert) {
      this.dispatch({
        type: this.RESPONSE_STATUS,
        payload: {
          status: "error",
          message: "Something went wrong!",
          type: 0,
          from: from,
        },
      });
    }
  }



  async commonResponse(data, from, noAlert) {
    if (!noAlert) {
      if (data?.status && data.status === "success") {
        this.dispatch({
          type: this.RESPONSE_STATUS,
          payload: {
            status: data.status,
            message: data.msg,
            from: from,
          },
        });
      } else if (data?.status && data.status === "error") {
        this.dispatch({
          type: this.RESPONSE_STATUS,
          payload: {
            status: data.status,
            message: data.response,
            from: from,
          },
        });
      } else {
        this.commonErrorResponse(from);
      }
    }
  }
}
