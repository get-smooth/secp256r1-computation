"""
This file is a modified version of the precomputation script from the FreshCryptoLib library by
@rdubois-crypto. It computes a precomputation table for the secp256r1 elliptic curve, given a public
key point Q. The precomputation table is used to speed up point multiplication operations during
ECDSA signing and verification. This version of the script has been simplified and adapted for
use in a specific project. The original file can be found at
https://github.com/rdubois-crypto/FreshCryptoLib/blob/d6efdb8927b4185bb194e24f7c94a399c98441a6/sage/FCL_ecdsa_precompute/FCL_ecdsa_precompute.sage.
"""

import os
import sys

#//curve secp256r1, aka p256
#//curve prime field modulus
sec256p_p = 0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF;
#//short weierstrass first coefficient
sec256p_a =0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC;
#//short weierstrass second coefficient
sec256p_b =0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B;
#//generating point affine coordinates
sec256p_gx =0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296;
sec256p_gy =0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5;
#//curve order (number of points)
sec256p_n =0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551;

# Initialize the curve
def Init_Curve(curve_characteristic,curve_a, curve_b,Gx, Gy, curve_Order):
	Fp=GF(curve_characteristic); 				#Initialize Prime field of Point
	Fq=GF(curve_Order);					#Initialize Prime field of scalars
	Curve=EllipticCurve(Fp, [curve_a, curve_b]);		#Initialize Elliptic curve
	curve_Generator=Curve([Gx, Gy]);

	return [Curve,curve_Generator];

#//Init the curve
secp256r1, G = Init_Curve(sec256p_p, sec256p_a, sec256p_b, sec256p_gx, sec256p_gy, sec256p_n);

def precompute_pubkey(Q, Curve):
  # Initialize the precomputed table and the powers of 64*q
  Pow64_PQ=[ Q for i in range(0,8)]; # G, G2, G3, G4, Q, Q2, Q3, Q4
  Prec=[ Curve(0) for i in range(0,256)]; # Prec is a table of 256 points

  Pow64_PQ[0]=Curve([sec256p_gx, sec256p_gy]);  # G
  Pow64_PQ[4]=Q;  # Q (PUBKEY)

  # Compute the powers of 64*q
  for j in [1..3]:
    Pow64_PQ[j]=2^64*Pow64_PQ[j-1]; # G2=2**64*G, G3=2**128*G, G4=2**256*G // ecmul
    Pow64_PQ[j+4]=2^64*Pow64_PQ[j+3]; # Q2=2**64*G, Q3=2**128*G, Q4=2**256*G // ecmul scalar*point

  # Compute the precomputed table
  Prec[0]=Curve(0); # Prec[0]=0*G

  for i in range(1,256):
    Prec[i]=Curve(0);
    for j in [0..7]:
      if( (i&(1<<j))!=0): # if bit j of i is set
        (Prec[i])=(Pow64_PQ[j]+ Prec[i]); # Prec[i]=Prec[i]+2**j*G // ecadd

  # Return the precomputed table
  return Prec;

def print_setlength(X, n):
    # Convert X to a hexadecimal string and remove the '0x' prefix
    hex_str = hex(X)[2:]

    # Add leading zeros to the string to make it length n
    return hex_str.rjust(n, '0')

def get_concatenate_point(Prec):
  coords = ""

  # Concatenate the x and y coordinates of each point in Prec
  for i in [0..255]:
    px=print_setlength( Prec[i][0], 64);
    py=print_setlength( Prec[i][1], 64);
    coords=coords+px+py; # Concatenate the x and y coordinates of Prec[i]

  # Join the coordinates into a single string
  return coords

if __name__ == '__main__':
  # Load the C0 and C1 environment variables
  C0 = int(os.environ['C0'])
  C1 = int(os.environ['C1'])

  # Compute the precomputed table
  Q = secp256r1([C0, C1])
  Prec = precompute_pubkey(Q, secp256r1)

  # Get the concatenated points and write them to stdout
  concatenated_points = get_concatenate_point(Prec)
  sys.stdout.write(concatenated_points)
