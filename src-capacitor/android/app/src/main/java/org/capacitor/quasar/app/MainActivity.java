package org.capacitor.quasar.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import com.github.tljk.CapacitorWebviewUpdatePlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    CapacitorWebviewUpdatePlugin capacitorWebviewUpdatePlugin = new CapacitorWebviewUpdatePlugin();
    capacitorWebviewUpdatePlugin.apply(getApplicationContext());

    super.onCreate(savedInstanceState);
  }
}
