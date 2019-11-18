package com.klabee.controller

import android.os.AsyncTask
import com.klabee.model.User
import org.json.JSONArray
import java.io.BufferedReader
import java.io.DataOutputStream
import java.io.InputStreamReader
import java.lang.Exception
import java.net.HttpURLConnection
import java.net.URL

class HistoryController : AsyncTask<Void, Void, JSONArray>() {
    override fun doInBackground(vararg params: Void?): JSONArray {
        try {
            val userAgent = "Mozilla/5.0"
            val url = URL("https://www.klabee.com/api/index.php")
            val httpURLConnection = url.openConnection() as HttpURLConnection

            //add request header
            httpURLConnection.requestMethod = "POST"
            httpURLConnection.setRequestProperty("User-Agent", userAgent)
            httpURLConnection.setRequestProperty("Accept-Language", "en-US,en;q=0.5")
            httpURLConnection.setRequestProperty("Accept", "application/json")

            val urlParameters = "a=HistoryWD&username=${User.username}"

            // Send post request
            httpURLConnection.doOutput = true
            val write = DataOutputStream(httpURLConnection.outputStream)
            write.writeBytes(urlParameters)
            write.flush()
            write.close()

            val responseCode = httpURLConnection.responseCode
            return if (responseCode == 200) {
                val input = BufferedReader(
                    InputStreamReader(httpURLConnection.inputStream)
                )

                val inputData: String = input.readLine()
                val response = JSONArray(inputData)
                input.close()
                response
            } else {
                JSONArray("[{Status: 1, Pesan: 'internet tidak setabil'}]")
            }
        }catch (e : Exception) {
            e.printStackTrace()
            return JSONArray("[{Status: 1, Pesan: 'internet tidak setabil'}]")
        }
    }
}