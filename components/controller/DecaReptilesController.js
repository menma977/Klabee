import React from 'react';
export default class LoginController extends React.Component {
    async DataLogin(setUsername, setPassword, setLong, setLat) {
        let url, body, errorResponse;
        url = "http://decareptiles.com/api/index.php";
        body = "a=Login" +
            "&username=" + setUsername +
            "&password=" + setPassword +
            "&long=" + setLong +
            "&lat=" + setLat;
        errorResponse = { Status: 1, Pesan: 'Internet tidak setabil mohon ulangi lagi' };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded',
                }),
                body: body
            });
            const responseJson = await response.json();
            if (responseJson) {
                return responseJson;
            } else {
                return errorResponse;
            }
        } catch (error) {
            return errorResponse;
        }
    }

    async SendBox(setQRCode, setImageUrl, setLong, setLat) {
        let url, body, errorResponse, dataQRCode;
        setQRCode.map((value, key) => {
            dataQRCode += "&notrx" + parseInt(key + 1) + "=" + value;
        })
        url = "http://decareptiles.com/api/index.php";
        body = "a=KirimKandang" +
            dataQRCode +
            "&gambar=" + setImageUrl +
            "&long=" + setLong +
            "&lat=" + setLat;
        errorResponse = { Status: 1, Pesan: 'Internet tidak setabil mohon ulangi lagi' };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded',
                }),
                body: body.replace('undefined', '')
            });
            const responseJson = await response.json();
            if (responseJson) {
                return responseJson;
            } else {
                return errorResponse;
            }
        } catch (error) {
            return errorResponse;
        }
    }

    async Vaccine(setQRCode, setLong, setLat) {
        let url, body, errorResponse;
        url = "http://decareptiles.com/api/index.php";
        body = "a=Vaksin" +
            "&notrx=" + setQRCode +
            "&gambar=''" +
            "&long=" + setLong +
            "&lat=" + setLat;
        errorResponse = { Status: 1, Pesan: 'Internet tidak setabil mohon ulangi lagi' };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded',
                }),
                body: body
            });
            const responseJson = await response.json();
            if (responseJson) {
                return responseJson;
            } else {
                return errorResponse;
            }
        } catch (error) {
            return errorResponse;
        }
    }

    async Dead(setQRCode, setImageUrl, setLong, setLat) {
        let url, body, errorResponse;
        url = "http://decareptiles.com/api/index.php";
        body = "a=Mati" +
            "&notrx=" + setQRCode +
            "&gambar=" + setImageUrl +
            "&long=" + setLong +
            "&lat=" + setLat;
        errorResponse = { Status: 1, Pesan: 'Internet tidak setabil mohon ulangi lagi' };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded',
                }),
                body: body
            });
            console.log(response);
            const responseJson = await response.json();
            if (responseJson) {
                return responseJson;
            } else {
                return errorResponse;
            }
        } catch (error) {
            console.log(error);
            return errorResponse;
        }
    }
}