import React from 'react';
export default class ProcessController extends React.Component {
  async saveClinet ( sponsor, username, password, name, address, email, hp, bank, codeBank ) {
    let url, body, errorResponse;
    url = "https://www.klabee.com/api/index.php";
    body = "a=AddClient" +
      "&sponsor=" + sponsor +
      "&username=" + username +
      "&password=" + password +
      "&alamat=" + address +
      "&email=" + email +
      "&nohp=" + hp +
      "&bank=" + bank +
      "&norek=" + codeBank +
      "&nama=" + name;
    errorResponse = {
      Status: 1,
      Pesan: 'Internet tidak setabil mohon ulangi lagi'
    };
    try {
      const response = await fetch( url, {
        method: 'POST',
        headers: new Headers( { 'Content-Type': 'application/x-www-form-urlencoded' } ),
        body: body
      } );
      const responseJson = await response.json();
      if ( responseJson ) {
        return responseJson;
      } else {
        return errorResponse;
      }
    } catch ( error ) {
      return errorResponse;
    }
  }

  async getClient ( username ) {
    let url, body, errorResponse;
    url = "https://www.klabee.com/api/index.php";
    body = "a=ListUser" + "&username=" + username;
    errorResponse = {
      Status: 1,
      Pesan: 'Internet tidak setabil mohon ulangi lagi'
    };
    try {
      const response = await fetch( url, {
        method: 'POST',
        headers: new Headers( { 'Content-Type': 'application/x-www-form-urlencoded' } ),
        body: body
      } );
      const responseJson = await response.json();
      if ( responseJson ) {
        return responseJson;
      } else {
        return errorResponse;
      }
    } catch ( error ) {
      return errorResponse;
    }
  }

  async ListStupe ( username ) {
    let url, body, errorResponse;
    url = "https://www.klabee.com/api/index.php";
    body = "a=ListStup" + "&username=" + username;
    errorResponse = {
      Status: 1,
      Pesan: 'Internet tidak setabil mohon ulangi lagi'
    };
    try {
      const response = await fetch( url, {
        method: 'POST',
        headers: new Headers( { 'Content-Type': 'application/x-www-form-urlencoded' } ),
        body: body
      } );
      const responseJson = await response.json();
      if ( responseJson ) {
        return responseJson;
      } else {
        return errorResponse;
      }
    } catch ( error ) {
      return errorResponse;
    }
  }

  async Balance ( username ) {
    let url, body, errorResponse;
    url = "https://www.klabee.com/api/index.php";
    body = "a=CekSaldo" +
      "&username=" + username;
    errorResponse = {
      Status: 1,
      Pesan: 'undefined'
    };
    try {
      const response = await fetch( url, {
        method: 'POST',
        headers: new Headers( { 'Content-Type': 'application/x-www-form-urlencoded' } ),
        body: body
      } );
      const responseJson = await response.json();
      if ( responseJson ) {
        return responseJson;
      } else {
        return errorResponse;
      }
    } catch ( error ) {
      return errorResponse;
    }
  }

  async SendBee ( user, clinet, setQRCode, setCount, setImageUrl, setLong, setLat, balance ) {
    let url,
      body,
      errorResponse,
      dataQRCode;
    // setQRCode.map( ( value, key ) => {
    //   dataQRCode += "&notrx" + parseInt( key + 1 ) + "=" + value;
    // } )
    url = "https://www.klabee.com/api/index.php ";
    body = "a=KirimStup" +
      "&notrx1=" + setQRCode +
      "&jumlah=" + 1 +
      "&gambar=" + setImageUrl +
      "&long=" + setLong +
      "&lat=" + setLat +
      "&user=" + user +
      "&client=" + clinet +
      "&saldo=" + balance;
    errorResponse = {
      Status: 1,
      Pesan: 'Internet tidak setabil mohon ulangi lagi'
    };
    try {
      const response = await fetch( url, {
        method: 'POST',
        headers: new Headers( { 'Content-Type': 'application/x-www-form-urlencoded' } ),
        body: body.replace( 'undefined', '' )
      } );
      const responseJson = await response.json();
      if ( responseJson ) {
        return responseJson;
      } else {
        return errorResponse;
      }
    } catch ( error ) {
      return errorResponse;
    }
  }

  async checkBee ( setQRCode, username ) {
    let url,
      body,
      errorResponse;
    url = "https://www.klabee.com/api/index.php";
    body = "a=CekStup" + "&kode=" + setQRCode + "&username=" + username;
    errorResponse = {
      Status: 1,
      Pesan: 'Internet tidak setabil mohon ulangi lagi'
    };
    try {
      const response = await fetch( url, {
        method: 'POST',
        headers: new Headers( { 'Content-Type': 'application/x-www-form-urlencoded' } ),
        body: body
      } );
      const responseJson = await response.json();
      if ( responseJson ) {
        return responseJson;
      } else {
        return errorResponse;
      }
    } catch ( error ) {
      return errorResponse;
    }
  }

  async BuyBack ( setQRCode, username ) {
    let url, body, errorResponse;
    url = "https://www.klabee.com/api/index.php";
    body = "a=BuyBack" + "&kode=" + setQRCode + "&username=" + username;
    errorResponse = {
      Status: 1,
      Pesan: 'Internet tidak setabil mohon ulangi lagi'
    };
    try {
      const response = await fetch( url, {
        method: 'POST',
        headers: new Headers( { 'Content-Type': 'application/x-www-form-urlencoded' } ),
        body: body
      } );
      const responseJson = await response.json();
      if ( responseJson ) {
        return responseJson;
      } else {
        return errorResponse;
      }
    } catch ( error ) {
      return errorResponse;
    }
  }

  async BrokenBox ( setQRCode, username ) {
    let url, body, errorResponse;
    url = "https://www.klabee.com/api/index.php";
    body = "a=Rusak" + "&kode=" + setQRCode + "&username=" + username;
    errorResponse = {
      Status: 1,
      Pesan: 'Internet tidak setabil mohon ulangi lagi'
    };
    try {
      const response = await fetch( url, {
        method: 'POST',
        headers: new Headers( { 'Content-Type': 'application/x-www-form-urlencoded' } ),
        body: body
      } );
      const responseJson = await response.json();
      if ( responseJson ) {
        return responseJson;
      } else {
        return errorResponse;
      }
    } catch ( error ) {
      return errorResponse;
    }
  }

  async EmptyStup ( setQRCodeEmpty, setQRCode, setImageUrl, setLong, setLat, setUsername ) {
    let url, body, errorResponse;
    url = "https://www.klabee.com/api/index.php";
    body = "a=Kosong" +
      "&username=" + setUsername +
      "&kode=" + setQRCodeEmpty +
      "&kodeganti=" + setQRCode +
      "&gambar=" + setImageUrl +
      "&long=" + setLong +
      "&lat=" + setLat;
    errorResponse = {
      Status: 1,
      Pesan: 'Internet tidak setabil mohon ulangi lagi'
    };
    try {
      const response = await fetch( url, {
        method: 'POST',
        headers: new Headers( { 'Content-Type': 'application/x-www-form-urlencoded' } ),
        body: body
      } );
      const responseJson = await response.json();
      if ( responseJson ) {
        return responseJson;
      } else {
        return errorResponse;
      }
    } catch ( error ) {
      return errorResponse;
    }
  }

  async validate ( setQRCode, setUsername ) {
    let url, body, errorResponse;
    url = "https://www.klabee.com/api/index.php";
    body = "a=CekStupKosong" +
      "&username=" + setUsername +
      "&kode=" + setQRCode;
    errorResponse = {
      Status: 1,
      Pesan: 'Internet tidak setabil mohon ulangi lagi'
    };
    try {
      const response = await fetch( url, {
        method: 'POST',
        headers: new Headers( { 'Content-Type': 'application/x-www-form-urlencoded' } ),
        body: body
      } );
      const responseJson = await response.json();
      if ( responseJson ) {
        return responseJson;
      } else {
        return errorResponse;
      }
    } catch ( error ) {
      return errorResponse;
    }
  }

  async ReqDep ( setNominal, setUsername ) {
    let url, body, errorResponse;
    url = "https://www.klabee.com/api/index.php";
    body = "a=ReqDep" +
      "&username=" + setUsername +
      "&nominal=" + setNominal;
    errorResponse = {
      Status: 1,
      Pesan: 'Internet tidak setabil mohon ulangi lagi'
    };
    try {
      const response = await fetch( url, {
        method: 'POST',
        headers: new Headers( { 'Content-Type': 'application/x-www-form-urlencoded' } ),
        body: body
      } );
      const responseJson = await response.json();
      if ( responseJson ) {
        return responseJson;
      } else {
        return errorResponse;
      }
    } catch ( error ) {
      return errorResponse;
    }
  }

  async Testimonies ( setUsername, setClient, setClientName, setDescription, setImageUrl ) {
    let url, body, errorResponse;
    url = "https://www.klabee.com/api/index.php";
    body = "a=Testimoni" +
      "&username=" + setUsername +
      "&userclient=" + setClient +
      "&name=" + setClientName +
      "&isitestimoni=" + setDescription +
      "&gambar=" + setImageUrl;
    errorResponse = {
      Status: 1,
      Pesan: 'Internet tidak setabil mohon ulangi lagi'
    };
    try {
      const response = await fetch( url, {
        method: 'POST',
        headers: new Headers( { 'Content-Type': 'application/x-www-form-urlencoded' } ),
        body: body
      } );
      const responseJson = await response.json();
      if ( responseJson ) {
        return responseJson;
      } else {
        return errorResponse;
      }
    } catch ( error ) {
      return errorResponse;
    }
  }

  async HistoryWithdraw ( setUsername ) {
    let url, body, errorResponse;
    url = "https://www.klabee.com/api/index.php";
    body = "a=HistoryWD" +
      "&username=" + setUsername;
    errorResponse = {
      Status: 1,
      Pesan: 'Internet tidak setabil mohon ulangi lagi'
    };
    try {
      const response = await fetch( url, {
        method: 'POST',
        headers: new Headers( { 'Content-Type': 'application/x-www-form-urlencoded' } ),
        body: body
      } );
      const responseJson = await response.json();
      if ( responseJson ) {
        return responseJson;
      } else {
        return errorResponse;
      }
    } catch ( error ) {
      return errorResponse;
    }
  }
}
