import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/purchase-orders:
 *   get:
 *     summary: Get all purchase orders
 *     description: Retrieve a list of all purchase orders with pagination
 *     tags: [Purchase Orders]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: List of purchase orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await query(
      `SELECT * FROM purchase_orders 
       ORDER BY order_date DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return NextResponse.json({ 
      success: true, 
      data: result.rows,
      count: result.rows.length 
    });
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/purchase-orders:
 *   post:
 *     summary: Create a new purchase order
 *     description: Create a new purchase order with vendor and product details
 *     tags: [Purchase Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - order_date
 *               - vendor_name
 *               - vendor_address
 *               - vendor_country
 *               - vendor_tax_id
 *               - vendor_company_reg_number
 *               - product_order_type
 *               - product_sku
 *               - product_description
 *               - ordered_qty
 *               - total_tax
 *               - delivery_location
 *               - promised_delivery_date
 *               - payment_terms
 *               - po_status
 *             properties:
 *               order_id:
 *                 type: string
 *               order_date:
 *                 type: string
 *                 format: date-time
 *               vendor_name:
 *                 type: string
 *               vendor_address:
 *                 type: string
 *               vendor_country:
 *                 type: string
 *               vendor_tax_id:
 *                 type: string
 *               vendor_company_reg_number:
 *                 type: string
 *               product_order_type:
 *                 type: string
 *               product_sku:
 *                 type: string
 *               product_description:
 *                 type: string
 *               ordered_qty:
 *                 type: integer
 *               total_tax:
 *                 type: number
 *               delivery_location:
 *                 type: string
 *               promised_delivery_date:
 *                 type: string
 *                 format: date-time
 *               payment_terms:
 *                 type: string
 *               po_status:
 *                 type: string
 *               tds_section:
 *                 type: string
 *     responses:
 *       201:
 *         description: Purchase order created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      order_id,
      order_date,
      vendor_name,
      vendor_address,
      vendor_country,
      vendor_tax_id,
      vendor_company_reg_number,
      product_order_type,
      product_sku,
      product_description,
      ordered_qty,
      total_tax,
      delivery_location,
      promised_delivery_date,
      payment_terms,
      po_status,
      tds_section
    } = body;

    if (!order_id || !vendor_name || !product_sku || !po_status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO purchase_orders (
        order_id, order_date, vendor_name, vendor_address, vendor_country,
        vendor_tax_id, vendor_company_reg_number, product_order_type,
        product_sku, product_description, ordered_qty, total_tax,
        delivery_location, promised_delivery_date, payment_terms,
        po_status, tds_section, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())
      RETURNING *`,
      [
        order_id, order_date, vendor_name, vendor_address, vendor_country,
        vendor_tax_id, vendor_company_reg_number, product_order_type,
        product_sku, product_description, ordered_qty, total_tax,
        delivery_location, promised_delivery_date, payment_terms,
        po_status, tds_section
      ]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating purchase order:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}