package org.capacitor.quasar.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import com.github.tljk.CapacitorWebviewUpdatePlugin;

import com.google.android.gms.cast.framework.CastContext;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    CapacitorWebviewUpdatePlugin capacitorWebviewUpdatePlugin = new CapacitorWebviewUpdatePlugin();
    capacitorWebviewUpdatePlugin.initWebview(getApplicationContext());

    super.onCreate(savedInstanceState);

    CastContext.getSharedInstance(this);
  }
}
