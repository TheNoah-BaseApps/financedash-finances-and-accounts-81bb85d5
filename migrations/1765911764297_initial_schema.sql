CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'user' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS accounts_payable (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  date date NOT NULL,
  invoice_number text NOT NULL UNIQUE,
  supplier_name text NOT NULL,
  total_amount decimal(15,2) NOT NULL,
  due_date date NOT NULL,
  balance_due decimal(15,2) NOT NULL,
  payment1 decimal(15,2) DEFAULT 0,
  payment2 decimal(15,2) DEFAULT 0,
  payment3 decimal(15,2) DEFAULT 0,
  payment4 decimal(15,2) DEFAULT 0,
  payment5 decimal(15,2) DEFAULT 0,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_accounts_payable_user_id ON accounts_payable (user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_payable_due_date ON accounts_payable (due_date);
CREATE INDEX IF NOT EXISTS idx_accounts_payable_status ON accounts_payable (status);
CREATE INDEX IF NOT EXISTS idx_accounts_payable_invoice_number ON accounts_payable (invoice_number);

CREATE TABLE IF NOT EXISTS accounts_receivable (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  invoice_date date NOT NULL,
  invoice_number text NOT NULL UNIQUE,
  customer text NOT NULL,
  terms text NOT NULL,
  total_amount decimal(15,2) NOT NULL,
  date_due date NOT NULL,
  balance_due decimal(15,2) NOT NULL,
  payment1 decimal(15,2) DEFAULT 0,
  payment2 decimal(15,2) DEFAULT 0,
  payment3 decimal(15,2) DEFAULT 0,
  payment4 decimal(15,2) DEFAULT 0,
  payment5 decimal(15,2) DEFAULT 0,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_user_id ON accounts_receivable (user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_date_due ON accounts_receivable (date_due);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_status ON accounts_receivable (status);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_invoice_number ON accounts_receivable (invoice_number);

CREATE TABLE IF NOT EXISTS cash_flow_forecast (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  category text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  beginning_balance decimal(15,2) NOT NULL,
  cash_sales decimal(15,2) DEFAULT 0,
  customer_account_collections decimal(15,2) DEFAULT 0,
  loan_cash_injection decimal(15,2) DEFAULT 0,
  interest_income decimal(15,2) DEFAULT 0,
  tax_refund decimal(15,2) DEFAULT 0,
  other_cash_receipts decimal(15,2) DEFAULT 0,
  direct_product_svc_costs decimal(15,2) DEFAULT 0,
  payroll_taxes decimal(15,2) DEFAULT 0,
  vendor_payments decimal(15,2) DEFAULT 0,
  supplies decimal(15,2) DEFAULT 0,
  rent decimal(15,2) DEFAULT 0,
  loan_payments decimal(15,2) DEFAULT 0,
  purchase_of_fixed_assets decimal(15,2) DEFAULT 0,
  additional_operating_expenses decimal(15,2) DEFAULT 0,
  additional_overhead_expenses decimal(15,2) DEFAULT 0,
  total_cash_payments decimal(15,2) NOT NULL,
  net_cash_change decimal(15,2) NOT NULL,
  month_ending_cash_position decimal(15,2) NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cash_flow_forecast_user_id ON cash_flow_forecast (user_id);
CREATE INDEX IF NOT EXISTS idx_cash_flow_forecast_period ON cash_flow_forecast (period_start, period_end);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL,
  old_values jsonb,
  new_values jsonb,
  timestamp timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs (table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs (timestamp);