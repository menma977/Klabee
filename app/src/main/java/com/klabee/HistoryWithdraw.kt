package com.klabee

import android.annotation.SuppressLint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TableLayout
import android.widget.TableRow
import android.widget.TextView
import com.klabee.controller.HistoryController
import java.text.NumberFormat
import java.util.*

class HistoryWithdraw : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_history_withdraw)
        getList()
    }

    @SuppressLint("SetTextI18n")
    private fun getList() {
        val localIDR = Locale("in", "ID")
        val numberFormat = NumberFormat.getCurrencyInstance(localIDR)

        val tableLayout = findViewById<TableLayout>(R.id.historyTable)
        tableLayout.removeAllViews()
        val tableRow0 = TableRow(this)

        val optionRow = TableRow.LayoutParams(
            TableRow.LayoutParams.MATCH_PARENT,
            TableRow.LayoutParams.MATCH_PARENT,
            0f
        )

        optionRow.topMargin = 10
        optionRow.bottomMargin = 20

        tableRow0.layoutParams = optionRow

        val optionHeader = TableRow.LayoutParams(
            TableRow.LayoutParams.WRAP_CONTENT,
            TableRow.LayoutParams.WRAP_CONTENT,
            1.0f
        )

        optionHeader.bottomMargin = 20
        optionHeader.marginEnd = 80

        val usernameUser = TextView(this)
        usernameUser.text = "Username"
        usernameUser.layoutParams = optionHeader
        tableRow0.addView(usernameUser)

        val name = TextView(this)
        name.text = "Name"
        name.layoutParams = optionHeader
        tableRow0.addView(name)

        val admin = TextView(this)
        admin.text = "Admin"
        admin.layoutParams = optionHeader
        tableRow0.addView(admin)

        val bonus = TextView(this)
        bonus.text = "Bonus"
        bonus.layoutParams = optionHeader
        tableRow0.addView(bonus)

        val bank = TextView(this)
        bank.text = "Bank"
        bank.layoutParams = optionHeader
        tableRow0.addView(bank)

        val accountNumber = TextView(this)
        accountNumber.text = "Rekening"
        accountNumber.layoutParams = optionHeader
        tableRow0.addView(accountNumber)

        val date = TextView(this)
        date.text = "Tanggal"
        date.layoutParams = optionHeader
        tableRow0.addView(date)

        val totalTransfer = TextView(this)
        totalTransfer.text = "Jumlah Transfer"
        totalTransfer.layoutParams = optionHeader
        tableRow0.addView(totalTransfer)

        tableLayout.addView(tableRow0)

        val optionItem = TableRow.LayoutParams(
            TableRow.LayoutParams.WRAP_CONTENT,
            TableRow.LayoutParams.WRAP_CONTENT,
            1.0f
        )

        optionItem.bottomMargin = 25
        optionItem.marginEnd = 80

        val listHistory = HistoryController().execute()
        val response = listHistory.get()

        if (response.length() != 0) {
            for (values in 0 until response.length()) {
                if (response.getJSONObject(values)["User"].toString() != "Default") {
                    val tableRow = TableRow(this)
                    tableRow.layoutParams = optionRow

                    val usernameUserLoop = TextView(this)
                    usernameUserLoop.text = response.getJSONObject(values)["User"].toString()
                    usernameUserLoop.layoutParams = optionHeader
                    tableRow.addView(usernameUserLoop)

                    val nameLoop = TextView(this)
                    nameLoop.text = response.getJSONObject(values)["Nama"].toString()
                    nameLoop.layoutParams = optionHeader
                    tableRow.addView(nameLoop)

                    val adminLoop = TextView(this)
                    adminLoop.text = response.getJSONObject(values)["Admin"].toString()
                    adminLoop.layoutParams = optionHeader
                    tableRow.addView(adminLoop)

                    val bonusLoop = TextView(this)
                    bonusLoop.text = response.getJSONObject(values)["Bonus"].toString()
                    bonusLoop.layoutParams = optionHeader
                    tableRow.addView(bonusLoop)

                    val bankLoop = TextView(this)
                    bankLoop.text = if (response.getJSONObject(values)["Bank"].toString().isEmpty()) "N/A" else response.getJSONObject(values)["Bank"].toString()
                    bankLoop.layoutParams = optionHeader
                    tableRow.addView(bankLoop)

                    val accountNumberLoop = TextView(this)
                    accountNumberLoop.text = response.getJSONObject(values)["Norek"].toString()
                    accountNumberLoop.layoutParams = optionHeader
                    tableRow.addView(accountNumberLoop)

                    val dateLoop = TextView(this)
                    dateLoop.text = response.getJSONObject(values)["Tgl"].toString()
                    dateLoop.layoutParams = optionHeader
                    tableRow.addView(dateLoop)

                    val totalTransferLoop = TextView(this)
                    totalTransferLoop.text = numberFormat.format(response.getJSONObject(values)["Transfer"].toString().toBigInteger())
                    totalTransferLoop.layoutParams = optionHeader
                    tableRow.addView(totalTransferLoop)

                    tableLayout.addView(tableRow)
                }
            }
        }
    }
}
