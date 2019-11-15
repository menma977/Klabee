package com.klabee

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button

class Menu : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view: View = inflater.inflate(R.layout.fragment_menu, container, false)

        var goTo : Intent
        val addClient : Button = view.findViewById(R.id.AddClient)
        val requestDeposit : Button = view.findViewById(R.id.RequestDeposit)
        val userList : Button = view.findViewById(R.id.UserList)
        val historyWithdraw : Button = view.findViewById(R.id.HistoryWithdraw)

        addClient.setOnClickListener {
            goTo = Intent(activity, AddClient::class.java)
            startActivity(goTo)
        }

        requestDeposit.setOnClickListener {
            goTo = Intent(activity, RequestDeposit::class.java)
            startActivity(goTo)
        }

        userList.setOnClickListener {
            goTo = Intent(activity, UserList::class.java)
            startActivity(goTo)
        }

        historyWithdraw.setOnClickListener {
            goTo = Intent(activity, HistoryWithdraw::class.java)
            startActivity(goTo)
        }

        return view
    }
}