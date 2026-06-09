'use client';

import { buttonVariants, cn } from '@repo/ui';
import { adminGenerateCodeResponseSchema } from '@repo/types';
import { useEffect, useState } from 'react';

import { StatusPill, type StatusTone } from '@/components/shared/status-pill';
import { authedRequest } from '@/services/client-api';

import type { AdminCode } from './admin-data';

const statusTone: Record<AdminCode['status'], StatusTone> = {
  active: 'success',
  redeemed: 'neutral',
  expired: 'warning',
  revoked: 'danger',
};

const kindLabels: Record<AdminCode['kind'], string> = {
  gift: 'Gift',
  promo: 'Promo',
  admin: 'Admin',
};

type ProductOption = { slug: string; name: string };

const fieldClass =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50';

function GenerateDialog({
  products,
  onClose,
  onGenerate,
}: {
  products: ProductOption[];
  onClose: () => void;
  onGenerate: (code: AdminCode) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState<'random' | 'custom'>('random');
  const [prefix, setPrefix] = useState('LIEM');
  const [customCode, setCustomCode] = useState('');
  const [uses, setUses] = useState('1');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function toggleProduct(slug: string) {
    setSelected((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (selected.length === 0) {
      setError('Select at least one product to grant.');
      return;
    }

    const usesNumber = Math.max(1, Math.floor(Number(uses) || 1));

    if (mode === 'custom' && customCode.trim().length < 4) {
      setError('Custom code must be at least 4 characters.');
      return;
    }

    setPending(true);

    try {
      const response = await authedRequest('/admin/codes', {
        body: JSON.stringify({
          code: mode === 'custom' ? customCode.trim() : undefined,
          mode,
          prefix: mode === 'random' ? prefix.trim() : undefined,
          productSlugs: selected,
          uses: usesNumber,
        }),
        method: 'POST',
      });
      const { data } = adminGenerateCodeResponseSchema.parse(await response.json());

      onGenerate({
        code: data.code,
        createdAt: new Date().toISOString().slice(0, 10),
        kind: data.kind,
        product: data.product,
        status: 'active',
        uses: data.uses,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not generate the code.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-foreground/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="generate-code-title"
        className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-background p-6 shadow-lg"
      >
        <h3 id="generate-code-title" className="text-base font-semibold text-foreground">
          Generate code
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Grant one or more products with a single redeem code.
        </p>

        <form onSubmit={submit} className="mt-5 space-y-5">
          <fieldset>
            <legend className="text-sm font-medium text-foreground">Products</legend>
            <div className="mt-2 max-h-44 space-y-2 overflow-y-auto rounded-md border border-border p-3">
              {products.map((product) => (
                <label
                  key={product.slug}
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(product.slug)}
                    onChange={() => toggleProduct(product.slug)}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  {product.name}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium text-foreground">Code</legend>
            <div className="mt-2 flex gap-4 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'random'}
                  onChange={() => setMode('random')}
                  className="h-4 w-4 border-input accent-primary"
                />
                Random
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'custom'}
                  onChange={() => setMode('custom')}
                  className="h-4 w-4 border-input accent-primary"
                />
                Custom
              </label>
            </div>

            {mode === 'random' ? (
              <div className="mt-3">
                <label className="grid gap-1 text-xs font-medium text-muted-foreground">
                  Prefix
                  <input
                    value={prefix}
                    onChange={(event) => setPrefix(event.target.value)}
                    placeholder="LIEM"
                    className={fieldClass}
                  />
                </label>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  Example: {(prefix.trim() || 'LIEM').toUpperCase().replace(/[^A-Z0-9]/g, '')}-AB12-CD34
                </p>
              </div>
            ) : (
              <input
                value={customCode}
                onChange={(event) => setCustomCode(event.target.value)}
                placeholder="e.g. WELCOME-LIEM"
                className={cn(fieldClass, 'mt-3 font-mono uppercase')}
              />
            )}
          </fieldset>

          <label className="grid gap-1 text-sm font-medium text-foreground">
            Uses (how many redemptions)
            <input
              type="number"
              min={1}
              step={1}
              value={uses}
              onChange={(event) => setUses(event.target.value)}
              className={cn(fieldClass, 'max-w-32')}
            />
            <span className="text-xs font-normal text-muted-foreground">
              1 = single use. Higher = can be redeemed by that many people.
            </span>
          </label>

          {error ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Cancel
            </button>
            <button type="submit" disabled={pending} className={cn(buttonVariants())}>
              {pending ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CodesManager({
  initialCodes,
  products,
}: {
  initialCodes: AdminCode[];
  products: ProductOption[];
}) {
  const [codes, setCodes] = useState(initialCodes);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Codes</h2>
        <button type="button" onClick={() => setOpen(true)} className={cn(buttonVariants({ size: 'sm' }))}>
          Generate codes
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Kind</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Uses</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {codes.map((code) => (
              <tr key={code.code} className="transition-colors hover:bg-secondary/30">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-foreground">
                  {code.code}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{kindLabels[code.kind]}</td>
                <td className="px-4 py-3 text-muted-foreground">{code.product}</td>
                <td className="px-4 py-3 text-muted-foreground">{code.uses}</td>
                <td className="px-4 py-3">
                  <StatusPill tone={statusTone[code.status]}>{code.status}</StatusPill>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {code.createdAt}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button
                    type="button"
                    disabled={code.status !== 'active'}
                    className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open ? (
        <GenerateDialog
          products={products}
          onClose={() => setOpen(false)}
          onGenerate={(code) => {
            setCodes((current) => [code, ...current]);
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
